import { RouteObject } from "react-router";
import Home from "../sites/home/home";
import Auth from "../sites/auth/auth";
import { createBrowserRouter } from "react-router-dom";
import Subscribe from "../sites/subscribe/subscribe";
import Profile from "../sites/profile/profile";
import Gallery from "../sites/gallery/gallery";
import Features from "../sites/features/features";
import Docs from "../sites/docs/docs";
import Uploading from "../sites/uploading/uploading";

export const routes: RouteObject[] = [
	{
		path: "/",
		element: <Home />
	},
	{
		path: "/auth/*",
		element: <Auth />
	},
	{
		path: "/auth",
		element: <Auth />
	},
	{
		path: "/uploading",
		element: <Uploading />
	},
	{
		path: "/subscribe",
		element: <Subscribe />
	},
	{
		path: "/features",
		element: <Features />
	},
	{
		path: "/about",
		element: <div>About us</div>
	},
	{
		path: "/profile/*",
		element: <Profile />
	},
	{
		path: "/profile/tokens/*",
		element: <Profile />
	},
	{
		path: "/profile/custom-domain/*",
		element: <Profile />
	},
	{
		path: "/profile/subdomain/*",
		element: <Profile />
	},
	{
		path: "/profile",
		element: <Profile />
	},
	{
		path: "/docs",
		element: <Docs />
	},
	// Footer links
	{
		path: "/terms",
		element: <div>Terms of service</div>
	},
	{
		path: "/privacy",
		element: <div>Privacy policy</div>
	},
	{
		path: "/support",
		element: <div>Support</div>
	},
	{
		path: "/contact",
		element: <div>Contact us</div>
	}
]

export const Router = createBrowserRouter(routes);