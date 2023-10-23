import { GetStaticProps } from "next";
import { sanityClient, urlFor } from "../../sanity";
import Header from "@/components/Header";
import Head from "next/head";
import PortableText from "react-portable-text";
import CommentForm from "@/components/CommentForm";

interface Props {
	post: BlogPost;
}

function Post({ post }: Props) {
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

			<CommentForm id={post._id} />

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
