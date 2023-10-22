function Banner() {
	return (
		<div className="flex justify-evenly items-center bg-yellow-400 border-y border-black py-14">
			<div className="px-10 space-y-5">
				<h1 className="text-5xl  lg:text-6xl max-w-xl font-serif">
					<span className="underline decoration-black decoration-4">
						Medium
					</span>{" "}
					is a place to write, read, and connect
				</h1>
				<h2>
					It&apos;s easy and free to post your thinking on any topic and connect
					with millions of readers.
				</h2>
			</div>

			<img
				className="hidden md:pr-10 lg:pr-0 md:inline-flex md:h-32 lg:h-72"
				src="https://seekicon.com/free-icon-download/medium-m_1.svg"
				alt=""
			/>
		</div>
	);
}

export default Banner;
