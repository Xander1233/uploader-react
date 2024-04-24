import { Box, Button, Stack, Typography } from "@mui/joy";

export default function Home() {
	return (
		<Stack alignItems={"center"} justifyContent={"center"} gap={3} sx={{height: "50vh"}}>
			<Typography level="h1">SparkCloud CDN</Typography>
			<Typography level="title-lg">An easy-to-use CDN for everyone.</Typography>

			<Button size="lg" variant="solid" component="a" href="/auth/register" sx={{borderRadius: "sm"}}>
				Get started
			</Button>
		</Stack>
	);
}