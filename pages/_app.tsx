import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Open_Sans } from "next/font/google";
import ProgressBar from "@badrap/bar-of-progress";
import { Router } from "next/router";

const openSans = Open_Sans({ subsets: ["latin"] });

const progress = new ProgressBar({
	size: 6,
	color: "rgb(250 204 21)",
	className: "z-50",
	delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

export default function App({ Component, pageProps }: AppProps) {
	return (
		<main className={openSans.className}>
			<Component {...pageProps} />
		</main>
	);
}
