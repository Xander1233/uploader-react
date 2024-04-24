import { Box, Button, Divider, Link, Stack, Typography } from "@mui/joy";
import { useNavigate } from "react-router";

export default function Features() {

	const navigate = useNavigate();

	return (
		<Stack spacing={15} direction={"column"} justifyContent={"center"} alignItems={"center"}>
			<Stack direction={"column"} justifyContent={"center"} alignItems={"center"} sx={{mt: "100px"}}>
				<Typography level="h1">Features</Typography>
				<Typography level="body-md">Discover the features of our platform</Typography>
			</Stack>

			<Stack direction={"row"} justifyContent={"center"} alignItems={"center"} spacing={20} sx={{mt: "50px"}}>
				<Stack direction={"column"} justifyContent={"center"} alignItems={"start"} spacing={5} sx={{width: "50%"}}>
					<Typography level="h2">Cloud Hosting</Typography>

					<Typography level="body-md" sx={{width: "100%"}}>
						Host your images on our cloud platform, or an cloud platform of your choice. <sup>1</sup>
					</Typography>
				</Stack>

				<Stack justifyContent={"center"} alignItems={"center"} sx={{width: "50%"}}>
					<img src="/cloud_hosting.svg" width="250" height="250" />
				</Stack>
			</Stack>

			<Stack direction={"row"} justifyContent={"center"} alignItems={"center"} spacing={20} sx={{mt: "50px"}}>
				<Stack justifyContent={"center"} alignItems={"center"} sx={{width: "50%"}}>
					<img src="/image_upload.svg" width="250" height="250" />
				</Stack>

				<Stack direction={"column"} justifyContent={"center"} alignItems={"start"} spacing={5} sx={{width: "50%"}}>
					<Typography level="h2">Upload images</Typography>

					<Typography level="body-md" sx={{width: "100%"}}>
						Upload your images and share them with your friends and family with a convenient link. <br />Compatible with <Link onClick={() => window.open("https://getsharex.com")}>ShareX</Link> <sup>2</sup>
					</Typography>
				</Stack>
			</Stack>

			<Stack direction={"column"} justifyContent={"start"} alignItems={"center"} spacing={10} sx={{height: "150px"}}>
				<Typography level="h2">
					Sign up now and get access to all the features by subscribing to our platform.
				</Typography>

				<Button size="lg" variant="solid" onClick={() => navigate("/auth/login")} sx={{borderRadius: "sm"}}>
					Sign up
				</Button>
			</Stack>

			<Box sx={{width: "100%"}}>
				<Divider orientation="horizontal" />

				<Box sx={{mt: "2rem", ml: "2rem"}}>
					<Typography level="body-xs">
						<sup>1</sup> - We support all major cloud providers like AWS, Azure, and Google Cloud. You can also host your images on our platform. The access to this feature is only available to plus and business plan users.
					</Typography>
					<Typography level="body-xs">
						<sup>2</sup> - ShareX is a free and open-source image sharing tool that allows you to upload images to various image hosting services. We are not affiliated with ShareX in any way. We support any image uploading tool that supports our API and upload structure.
					</Typography>
				</Box>
			</Box>
		</Stack>
	);
}
