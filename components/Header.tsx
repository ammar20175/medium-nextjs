import Link from "next/link";

function Header() {
	return (
		<header className="sticky top-0 z-50 p-5  shadow-md bg-white">
			<div className="flex justify-between max-w-7xl mx-auto">
				{/* left */}
				<div className="flex items-center space-x-5">
					<Link href="/">
						<img
							className="w-44 object-contain"
							src="https://links.papareact.com/yvf"
							alt="img"
						/>
					</Link>

					<div className="hidden md:inline-flex items-center space-x-5">
						<h3>About</h3>
						<h3>Contact</h3>
						<h3 className="text-white bg-green-600 px-4 py-1 rounded-full">
							Follow
						</h3>
					</div>
				</div>

				{/* right */}
				<div className="flex items-center space-x-5 text-green-600">
					<h3 className="cursor-pointer">Sign In</h3>
					<h3 className="cursor-pointer border px-4 py-1 rounded-full broder-green-600">
						Get Started
					</h3>
				</div>
			</div>
		</header>
	);
}

export default Header;
