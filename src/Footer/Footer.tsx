import { Box, Divider, List, ListItem, ListItemButton, Stack, Typography } from "@mui/joy";
import { useNavigate } from "react-router";

export default function Footer() {

	return (
		<Box sx={{mt: "30px"}}>
			<Divider />

			<Stack direction={"column"} justifyContent={"center"} alignItems={"center"} spacing={5} sx={{mb: "30px"}}>
				<Stack direction={"row"} justifyContent={"center"} alignItems={"center"} spacing={30}>
					<List sx={{width: "200px"}}>
						<ListItem>
							<ListItemButton component="a" href="/about">About us</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton component="a" href="/features">Features</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton component="a" href="/subscribe">Subscribe</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton component="a" href="/auth">Signin/Signup</ListItemButton>
						</ListItem>
					</List>

					<List sx={{width: "200px"}}>
						<ListItem>
							<ListItemButton component="a" href="/terms">Terms of service</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton component="a" href="/privacy">Privacy policy</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton component="a" href="/support">Support</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton component="a" href="/contact">Contact us</ListItemButton>
						</ListItem>
					</List>
				</Stack>

				<Typography sx={{pb: "30px"}}>© 2023 - 2024 SparkCloud UG. All rights reserved.</Typography>
			</Stack>
		</Box>
	);
}