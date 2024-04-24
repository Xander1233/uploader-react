import { AddLinkRounded, CollectionsRounded, KeyboardArrowRightRounded, LanguageRounded, TuneRounded, VpnKeyRounded } from "@mui/icons-material";
import { Avatar, Box, Grid, List, ListItem, ListItemButton, ListItemContent, ListItemDecorator, Skeleton, Stack } from "@mui/joy";
import { KeyObject } from "crypto";
import React from "react";
import { Auth } from "../../Shares/Auth";
import { Events } from "../../util/EventEmitter";
import { getInitials } from "../../util/getInitials";
import { useLocation } from "react-router";
import ProfileOverview from "./profileOverview/profileOverview";
import UploadTokens from "./uploadTokens/uploadTokens";
import Customization from "./customization/customization";
import DetailedToken from "./uploadTokens/detailedToken/detailedToken";
import Gallery from "../gallery/gallery";
import EditProfile from "./edit/edit";
import CustomDomainTab from "./customDomain/customDomain";
import CustomDomainEdit from "./customDomain/edit/customDomainEdit";
import SubdomainEdit from "./subdomain/edit/subdomainEdit";
import SubdomainTab from "./subdomain/subdomain";

enum ProfileTabs {
	PROFILE = 'profile',
	TOKENS = 'tokens',
	CUSTOMIZATION = 'customization',
	DETAILED_TOKEN = 'detailed_token',
	GALLERY = 'gallery',
	EDIT_PROFILE = 'edit_profile',
	CUSTOM_DOMAIN = 'custom_domain',
	CUSTOM_DOMAIN_EDIT = 'custom_domain_edit',
	SUBDOMAIN = 'subdomain',
	SUBDOMAIN_EDIT = 'subdomain_edit'
}

export default function Profile() {

	const [profile, setProfile] = React.useState<any>(Auth.shared.profile);

	const location = useLocation();

	const [activeTab, setActiveTab] = React.useState<ProfileTabs>(ProfileTabs.PROFILE);

	const [detailedToken, setDetailedToken] = React.useState<string | null>(null);

	function getTabFromPath() {
		
		let pathname = location.pathname.split("/").filter((x) => x.length > 0);

		if (pathname.length < 2) {
			setActiveTab(ProfileTabs.PROFILE);
			return;
		}

		if (pathname[1] === "edit") {
			setActiveTab(ProfileTabs.EDIT_PROFILE);
			return;
		}

		if (pathname[1] === "tokens") {
			if (pathname.length === 3) {
				setActiveTab(ProfileTabs.DETAILED_TOKEN);
				setDetailedToken(pathname[2]);
				return;
			}
			setActiveTab(ProfileTabs.TOKENS);
			return;
		}

		if (pathname[1] === "customization") {
			setActiveTab(ProfileTabs.CUSTOMIZATION);
			return;
		}

		if (pathname[1] === "gallery") {
			setActiveTab(ProfileTabs.GALLERY);
			return;
		}

		if (pathname[1] === "custom-domain" && pathname.length > 2 && pathname[2] === "edit") {
			setActiveTab(ProfileTabs.CUSTOM_DOMAIN_EDIT);
			return;
		}

		if (pathname[1] === "custom-domain") {
			setActiveTab(ProfileTabs.CUSTOM_DOMAIN);
			return;
		}

		if (pathname[1] === "subdomain" && pathname.length > 2 && pathname[2] === "edit") {
			setActiveTab(ProfileTabs.SUBDOMAIN_EDIT);
			return;
		}

		if (pathname[1] === "subdomain") {
			setActiveTab(ProfileTabs.SUBDOMAIN);
			return;
		}
	}

	React.useEffect(() => {

		getTabFromPath();

		Auth.shared.subscribe(Events.PROFILE_FETCHED, (profile) => {
			setProfile(profile);
		});
	}, []);

	return (
		<Stack direction={"row"} justifyContent={"center"} alignItems={"center"} sx={{width: "100vw"}}>
			<Grid container spacing={3} sx={{width: "80%", minHeight: "80vh"}}>
				<Grid xs={2.6}>
					<Stack>
						<List sx={{gap: "5px"}}>
							<ListItem sx={{mb: "40px"}}>
								<ListItemButton component="a" href="/profile">
									<ListItemDecorator sx={{mr: "20px"}}>
										<Skeleton variant="circular" loading={profile === null}>
											{profile !== null && profile.avatar_url && profile.avatar_url !== "" ? (
													<Avatar src={profile.avatar_url} />
											) : (
													<Avatar>{profile !== null ? getInitials(profile.display_name) : "N/A"}</Avatar>
											)}
										</Skeleton>
									</ListItemDecorator>
									<ListItemContent>
										<Skeleton variant="inline" loading={profile === null}>
											{profile === null ? "Fetching..." : profile.display_name}
										</Skeleton>
									</ListItemContent>
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton component="a" href="/profile/gallery">
									<ListItemDecorator><CollectionsRounded /></ListItemDecorator>
									<ListItemContent>Gallery</ListItemContent>
									<KeyboardArrowRightRounded />
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton component="a" href="/profile/tokens">
									<ListItemDecorator><VpnKeyRounded /></ListItemDecorator>
									<ListItemContent>Upload Tokens</ListItemContent>
									<KeyboardArrowRightRounded />
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton component="a" href="/profile/customization">
									<ListItemDecorator><TuneRounded /></ListItemDecorator>
									<ListItemContent>Customization</ListItemContent>
									<KeyboardArrowRightRounded />
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton component="a" href="/profile/custom-domain">
									<ListItemDecorator><LanguageRounded /></ListItemDecorator>
									<ListItemContent>Custom Domain</ListItemContent>
									<KeyboardArrowRightRounded />
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton component="a" href="/profile/subdomain">
									<ListItemDecorator><AddLinkRounded /></ListItemDecorator>
									<ListItemContent>Subdomain</ListItemContent>
									<KeyboardArrowRightRounded />
								</ListItemButton>
							</ListItem>
						</List>
					</Stack>
				</Grid>

				<Grid xs>
					{activeTab === ProfileTabs.PROFILE && <ProfileOverview />}
					{activeTab === ProfileTabs.TOKENS && <UploadTokens />}
					{activeTab === ProfileTabs.CUSTOMIZATION && <Customization />}
					{activeTab === ProfileTabs.DETAILED_TOKEN && <DetailedToken tokenId={detailedToken!} />}
					{activeTab === ProfileTabs.GALLERY && <Gallery />}
					{activeTab === ProfileTabs.EDIT_PROFILE && <EditProfile />}
					{activeTab === ProfileTabs.CUSTOM_DOMAIN && <CustomDomainTab />}
					{activeTab === ProfileTabs.CUSTOM_DOMAIN_EDIT && <CustomDomainEdit />}
					{activeTab === ProfileTabs.SUBDOMAIN && <SubdomainTab />}
					{activeTab === ProfileTabs.SUBDOMAIN_EDIT && <SubdomainEdit />}
				</Grid>

			</Grid>
		</Stack>
	)
}