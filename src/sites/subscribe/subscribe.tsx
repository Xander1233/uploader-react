import { Box, Button, Card, CardContent, Divider, Link, List, ListItem, Modal, ModalClose, Sheet, Stack, ToggleButtonGroup, Typography } from "@mui/joy";
import React from "react";
import { Auth, AuthState } from "../../Shares/Auth";
import { useNavigate } from "react-router";
import { mapPriceId } from "../../util/mapPriceId";

export default function Subscribe() {

	const [billingInterval, setBillingInterval] = React.useState<"month" | "year">("month");

	const [checkoutUrl, setCheckoutUrl] = React.useState<string>("");

	const [selectedPlan, setSelectedPlan] = React.useState<"base" | "standard" | "plus" | "business">("base");

	const navigate = useNavigate();

	async function subscribe(plan: string, interval: "month" | "year") {

		if (Auth.shared.isAuth !== AuthState.AUTH) {
			navigate("/auth/login?redirect=/subscribe");
			return;
		}

		let priceId = mapPriceId(plan, interval);

		const checkoutUrl = await Auth.shared.createCheckoutSession(priceId);

		console.log(checkoutUrl);

		if (checkoutUrl) {
			setSelectedPlan(plan as any);
			setCheckoutUrl(checkoutUrl);
		} else {
			alert("An error occurred while creating the checkout session. Please try again later.");
		}
	}
	
	return (
		<Box>

			<Modal open={checkoutUrl !== ""} onClose={() => setCheckoutUrl("")} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<Sheet variant="outlined" sx={{ maxWidth: 400, borderRadius: 'md', p: 3, boxShadow: 'lg'}}>
					<ModalClose sx={{m: 1}} />
					<Typography level="h3">Checkout</Typography>

					<Stack direction="column" spacing={2}>
						<Typography level="body-xs">You are about to subscribe to {selectedPlan}. Please complete the payment process with Stripe to continue.</Typography>
						<Button onClick={() => window.open(checkoutUrl, "_blank")} variant="solid">Proceed to checkout</Button>
					</Stack>
				</Sheet>
			</Modal>

			<Stack direction={"row"} alignContent={"center"} justifyContent={"center"}>
				<ToggleButtonGroup color="primary" value={billingInterval} variant="outlined" size="lg" onChange={(_, newInterval) => {
					if (newInterval) {
						setBillingInterval(newInterval);
					}
				}}>
					<Button value="month">Monthly</Button>
					<Button value="year">Yearly</Button>
				</ToggleButtonGroup>
			</Stack>

			<Stack direction="row" alignContent={"center"} justifyContent={"center"}>
				<Stack direction={"row"} spacing={2} sx={{marginTop: "2rem"}}>
					<Card sx={{width: 320}}>
						<CardContent orientation="horizontal">
							<Box sx={{maxWidth: "60%"}}>
								<Typography level="h3">Base Tier</Typography>
								<Typography level="body-xs">Perfect for occasional users who need a little extra.</Typography>
							</Box>
							<Box sx={{ml: "auto"}}>
								<Typography level="h3">{billingInterval === "month" ? "6,99" : "4,99"} €</Typography>
								<Typography level="body-sm">per month</Typography>
								{billingInterval === "year" && <Typography level="body-xs">billed yearly</Typography>}
							</Box>
						</CardContent>

						<List component="ol" marker="disc" size="sm">
							<ListItem>20MB upload limit</ListItem>
							<ListItem>5GB storage</ListItem>
							<ListItem>
								Basic customization
								<List marker="circle" size="sm">
									<ListItem>Embed color</ListItem>
									<ListItem>Web background color</ListItem>
								</List>
							</ListItem>
							<ListItem>50 private uploads <sup>1</sup></ListItem>
						<ListItem>25 password protected uploads <sup>1</sup></ListItem>
						</List>

						<Divider orientation="horizontal" />

						<Stack alignContent={"stretch"} justifyContent={"center"} spacing={1}>
							<Button variant="solid" onClick={() => subscribe("base", billingInterval)}><Typography level="h4">Subscribe</Typography></Button>
							<Stack alignItems={"center"} justifyContent={"center"}>
								<Typography level="body-xs">Payments with Stripe</Typography>
							</Stack>
						</Stack>
					</Card>

					<Card sx={{width: 320}}>
						<CardContent orientation="horizontal">
							<Box sx={{maxWidth: "60%"}}>
								<Typography level="h3">Standard Tier</Typography>
								<Typography level="body-xs">
									Recommended for the regular user who needs more storage and customization.
								</Typography>
							</Box>
							<Box sx={{ml: "auto"}}>
								<Typography level="h3">{billingInterval === "month" ? "14,99" : "9,99"} €</Typography>
								<Typography level="body-sm">per month</Typography>
								{billingInterval === "year" && <Typography level="body-xs">billed yearly</Typography>}
							</Box>
						</CardContent>

						<List component="ol" marker="disc" size="sm">
							<ListItem>50MB upload limit</ListItem>
							<ListItem>15GB storage</ListItem>
							<ListItem>
								Advanced customization <sup>2</sup>
								<List marker="circle" size="sm">
									<ListItem>Embed title</ListItem>
									<ListItem>Web title</ListItem>
								</List>
							</ListItem>
							<ListItem>100 private uploads <sup>1</sup></ListItem>
							<ListItem>50 password protected uploads <sup>1</sup></ListItem>
						</List>

						<Divider orientation="horizontal" />

						<Stack alignContent={"stretch"} justifyContent={"center"} spacing={1}>
							<Button variant="solid" onClick={() => subscribe("standard", billingInterval)}><Typography level="h4">Subscribe</Typography></Button>
							<Stack alignItems={"center"} justifyContent={"center"}>
								<Typography level="body-xs">Payments with Stripe</Typography>
							</Stack>
						</Stack>
					</Card>

					<Card sx={{width: 320}}>
						<CardContent orientation="horizontal">
							<Box sx={{maxWidth: "60%"}}>
								<Typography level="h3">Plus Tier</Typography>
								<Typography level="body-xs">
									For the power user who needs even more storage and customization options.
								</Typography>
							</Box>
							<Box sx={{ml: "auto"}}>
								<Typography level="h3">{billingInterval === "month" ? "24,99" : "19,99"} €</Typography>
								<Typography level="body-sm">per month</Typography>
								{billingInterval === "year" && <Typography level="body-xs">billed yearly</Typography>}
							</Box>
						</CardContent>

						<List component="ol" marker="disc" size="sm">
							<ListItem>100MB upload limit</ListItem>
							<ListItem>50GB storage</ListItem>
							<ListItem>
								Professional customization <sup>3</sup>
								<List marker="circle" size="sm">
									<ListItem>Custom subdomain <sup>4</sup></ListItem>
									<ListItem>Cloud storage integration <sup>5</sup></ListItem>
								</List>
							</ListItem>
							<ListItem>250 private uploads <sup>1</sup></ListItem>
							<ListItem>200 password protected uploads <sup>1</sup></ListItem>
						</List>

						<Divider orientation="horizontal" />

						<Stack alignContent={"stretch"} justifyContent={"center"} spacing={1}>
							<Button variant="solid" onClick={() => subscribe("plus", billingInterval)}><Typography level="h4">Subscribe</Typography></Button>
							<Stack alignItems={"center"} justifyContent={"center"}>
								<Typography level="body-xs">Payments with Stripe</Typography>
							</Stack>
						</Stack>
					</Card>

					<Card sx={{width: 320}}>
						<CardContent orientation="horizontal">
							<Box sx={{maxWidth: "60%"}}>
								<Typography level="h3">Business Tier</Typography>
								<Typography level="body-xs">
									Enterprise-grade features for the professional user who needs the best of the best.
								</Typography>
							</Box>
							<Box sx={{ml: "auto"}}>
								<Typography level="h3">{billingInterval === "month" ? "49,99" : "39,99"} €</Typography>
								<Typography level="body-sm">per month</Typography>
								{billingInterval === "year" && <Typography level="body-xs">billed yearly</Typography>}
							</Box>
						</CardContent>

						<List component="ol" marker="disc" size="sm">
							<ListItem>500MB upload limit</ListItem>
							<ListItem>250GB storage</ListItem>
							<ListItem>
								Enterprise customization <sup>6</sup>
								<List marker="circle" size="sm">
									<ListItem>Custom domain <sup>7</sup></ListItem>
									<ListItem>Custom cloud integration<sup>8</sup></ListItem>
								</List>
							</ListItem>
							<ListItem>1000 private uploads<sup>1</sup></ListItem>
							<ListItem>750 password protected uploads <sup>1</sup></ListItem>
						</List>

						<Divider orientation="horizontal" />

						<Stack alignContent={"stretch"} justifyContent={"center"} spacing={1}>
							<Button variant="solid" onClick={() => subscribe("business", billingInterval)}><Typography level="h4">Subscribe</Typography></Button>
							<Stack alignItems={"center"} justifyContent={"center"}>
								<Typography level="body-xs">Payments with Stripe</Typography>
							</Stack>
						</Stack>
					</Card>
				</Stack>
			</Stack>

			<Divider orientation="horizontal" sx={{mt: "2rem"}} />

			<Box sx={{mt: "2rem", ml: "2rem"}}>
				<Typography level="body-xs">
					<sup>1</sup> - Private and password protected uploads are only available until the storage limit is reached. The limit is for the total number of simultaneous private/password protected uploads.
				</Typography>
				<Typography level="body-xs">
					<sup>2</sup> - Advanced customization includes the customization of the basic customization options.
				</Typography>
				<Typography level="body-xs">
					<sup>3</sup> - Professional customization includes the customization of the advanced customization options.
				</Typography>
				<Typography level="body-xs">
					<sup>4</sup> - Custom subdomains are subject to availability and approval by SparkCloud CDN staff.
				</Typography>
				<Typography level="body-xs">
					<sup>5</sup> - Cloud storage integration allows you to link your cloud storage provider to your SparkCloud CDN account. Available providers are Google Cloud Storage, Amazon S3, and Microsoft Azure Blob Storage.
				</Typography>
				<Typography level="body-xs">
					<sup>6</sup> - Enterprise customization includes the customization of the professional customization options.
				</Typography>
				<Typography level="body-xs">
					<sup>7</sup> - Custom domains are subject to approval by SparkCloud CDN staff. The ownership of the domain must be verified before it can be linked to your SparkCloud CDN account.
				</Typography>
				<Typography level="body-xs">
					<sup>8</sup> - Custom cloud integration allows you to link your own cloud storage to your SparkCloud CDN account. The cloud storage provider must be compatible with the SparkCloud CDN API.
				</Typography>
			</Box>

		</Box>
	);
}