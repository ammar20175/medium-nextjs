import Link from "next/link";
import { urlFor } from "../sanity";

function Post({ _id, slug, title, description, author, mainImage }: BlogPost) {
	console.log(slug);
	return (
		<Link href={`/post/${slug.current}`} className="">
			<article className="border rounded-lg overflow-hidden group">
				<img
					className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
					src={urlFor(mainImage).url()!}
					alt=""
				/>

				<div className="flex justify-between items-center space-x-3 p-5 bg-white">
					<div>
						<p className="text-lg font-bold">{title}</p>
						<p className="text-sm">
							{description} by {author.name}
						</p>
					</div>

					<img
						className="h-12 w-12 rounded-full"
						src={urlFor(author.image).url()!}
						alt=""
					/>
				</div>
			</article>
		</Link>
	);
}

export default Post;
