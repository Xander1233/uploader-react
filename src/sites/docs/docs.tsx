import { Link, Stack, Typography } from "@mui/joy";

export default function Docs() {
	return (
		<Stack direction={"column"}>
			
			<Typography level="h1">Documentation</Typography>

			<Typography level="h2">Introduction</Typography>

			<Typography>
				Welcome to the SparkCloud CDN documentation. This documentation will help you to understand and use the SparkCloud CDN.
			</Typography>

			<Typography level="h2">Getting started</Typography>

			<Typography>
				To get started with SparkCloud CDN, you need to create an account. You can create an account <Link href="/auth/register">here</Link>.
			</Typography>

			<Typography level="h2">Features</Typography>

			<Typography>
				SparkCloud CDN provides a lot of features. You can find the features <Link href="/features">here</Link>.
			</Typography>

			<Typography level="h2">Uploading</Typography>

			<Typography>
				You can upload files to SparkCloud CDN by sending a POST request to the endpoint <code>https://sparkcloud.link/api/upload</code>.
				<br />
				The request's body must be a form-data with the field <code>file</code> containing the file you want to upload. You can also provide a field <code>private</code> and <code>password</code> to make the file private or set a password.
				<br />
				You will receive a JSON response with the URL of the uploaded file. The URL is in the json field <code>url</code>.
			</Typography>
		</Stack>
	);
}