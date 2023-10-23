import { GetStaticProps } from "next";
import { sanityClient, urlFor } from "../../sanity";
import Header from "@/components/Header";
import Head from "next/head";
import PortableText from "react-portable-text";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import comment from "@/medium/schemas/comment";

interface FormInputs {
	_id: string;
	name: string;
	email: string;
	comment: string;
}
interface Props {
	post: BlogPost;
}

function Post({ post }: Props) {
	const [submitted, setSubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInputs>();

	const onSubmit: SubmitHandler<FormInputs> = (data) => {
		fetch("/api/createComment", {
			method: "POST",
			body: JSON.stringify(data),
		})
			.then(() => {
				console.log(data);
				setSubmitted(true);
			})
			.catch((err) => {
				console.log(err);
				setSubmitted(false);
			});
	};

	return (
		<main>
			<Head>
				<title>{post.slug.current}</title>
			</Head>
			<Header />

			<img
				className="w-full h-48 object-cover"
				src={urlFor(post.mainImage).url()!}
				alt="img"
			/>

			<article className="max-w-4xl mx-auto p-5">
				<h1 className="text-3xl font-semibold mt-10 mb-3">{post.title}</h1>

				<h2 className="text-xl italic font-light text-gray-600 mb-3">
					{post.description}
				</h2>

				<div className="flex items-center space-x-2">
					<img
						className="h-10 w-10 rounded-full"
						src={urlFor(post.author.image).url()!}
						alt="img"
					/>

					<p className="font-light text-gray-500 text-sm">
						Blog post by{" "}
						<span className="text-green-600">{post.author.name}</span> -
						Published at {new Date(post._createdAt!).toLocaleString()}
					</p>
				</div>

				<div className="mt-10">
					<PortableText
						className=""
						dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
						projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
						content={post.body!}
						serializers={{
							h1: (props: any) => (
								<h1 className="text-2xl font-bold my-5" {...props} />
							),
							h2: (props: any) => (
								<h2 className="text-xl font-bold my-5" {...props} />
							),
							li: ({ children }: any) => (
								<li className="ml-4 list-disc">{children}</li>
							),
							link: ({ href, children }: any) => (
								<a href={href} className="text-blue-500 hover:underline">
									{children}
								</a>
							),
						}}
					/>
				</div>
			</article>

			<hr className="max-w-2xl mx-5 md:mx-auto my-5 border border-yellow-500" />

			{submitted ? (
				<div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-5 md:mx-auto">
					<h3 className="text-3xl font-bold mb-2">
						Thank you for submitting your comment
					</h3>

					<p>Once it has been approved, it will appear below!</p>
				</div>
			) : (
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
				>
					<h3 className="text-sm font-semibold text-yellow-500 mb-2">
						Enjoyed this article ?
					</h3>
					<h4 className="text-3xl font-bold">Leave a comment below!</h4>
					<hr className="py-3 mt-2" />

					<input {...register("_id")} type="hidden" value={post._id} />

					<label className="block mb-5">
						<span className="text-gray-700">Name</span>
						<input
							{...register("name", { required: true })}
							className="input form-input"
							type="text"
							placeholder="John"
						/>
					</label>

					<label className="block mb-5">
						<span className="text-gray-700">Email</span>
						<input
							{...register("email", { required: true })}
							className="input form-input "
							type="text"
							placeholder="John"
						/>
					</label>

					<label className="block mb-5">
						<span className="text-gray-700">Comment</span>
						<textarea
							{...register("comment", { required: true })}
							className="input form-textarea"
							placeholder="Type your comment here"
							rows={8}
						/>
					</label>

					<div className="flex flex-col p-5 text-red-500">
						{errors.name && <span>- Name is required</span>}
						{errors.email && <span>- Email is required</span>}
						{errors.comment && <span>- Comment is required</span>}
					</div>

					<button
						type="submit"
						className="shadow bg-yellow-500 hover:bg-yellow-600 focus:shadow-xl focus:outline-none text-white 
				font-bold py-2 px-4 rounded cursor-pointer"
					>
						Submit
					</button>
				</form>
			)}

			{/* comments */}
			<div className="flex flex-col p-10 my-10 max-w-2xl mx-5 md:mx-auto shadow-yellow-500 shadow space-y-2">
				<h3 className="text-3xl font-bold">Comments</h3>
				<hr className="pb-2" />

				{post.comments?.map((comment) => (
					<div key={comment._id}>
						<p>
							<span className="text-yellow-500">{comment.name} :</span>{" "}
							{comment.comment}
						</p>
					</div>
				))}
			</div>
		</main>
	);
}

export default Post;

export const getStaticPaths = async () => {
	const query = `*[_type == "post"]{
        _id,
        slug {
            current
        }
    }`;

	const posts = await sanityClient.fetch(query);

	const paths = posts.map((post: BlogPost) => ({
		params: {
			slug: post.slug.current,
		},
	}));

	return {
		paths,
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author-> {
            name,
            image
        },
        'comments':*[
            _type == "comment" &&
            post._ref == ^._id &&
            approved == true],
        description,
        mainImage,
        slug,
        body
    }`;

	const post = await sanityClient.fetch(query, { slug: params?.slug });

	if (!post) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			post,
		},
		revalidate: 60,
	};
};
