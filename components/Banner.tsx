function Banner() {
	return (
		<div className="flex justify-around items-center bg-yellow-400 border-y border-black py-14 md:py-20">
			<div className="px-10 space-y-5 max-w-xl lg:max-w-2xl">
				<h1 className="text-5xl lg:text-6xl xl:text-7xl font-serif">
					<span className="underline decoration-black decoration-4">
						Medium
					</span>{" "}
					is a place to write, read, and connect
				</h1>
				<h2 className="font-semibold">
					It&apos;s easy and free to post your thinking on any topic and connect
					with millions of readers.
				</h2>
			</div>

			<img
				className="hidden md:pr-10 lg:pr-0 md:inline-flex md:h-44 lg:h-72 xl:h-80"
				src="https://seekicon.com/free-icon-download/medium-m_1.svg"
				alt=""
			/>
		</div>
	);
}

export default Banner;
