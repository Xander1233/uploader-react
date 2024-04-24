import { ArticleRounded, AutoAwesomeRounded, CollectionsRounded, DarkModeRounded, HomeRounded, ImageRounded, InfoRounded, LightModeRounded, LoginRounded, LogoutRounded, PersonRounded, SwitchAccessShortcutAddRounded, UploadFileRounded } from "@mui/icons-material";
import { Avatar, Box, List, ListDivider, ListItem, ListItemButton, ListItemContent, ListItemDecorator, Skeleton, useColorScheme } from "@mui/joy";
import React from "react";
import { Auth, AuthState } from "../Shares/Auth";
import { Events } from "../util/EventEmitter";
import "./Menu.css";
import { getInitials } from "../util/getInitials";

export function Menu() {

	const { mode, setMode } = useColorScheme();

	const [isAuth, setIsAuth] = React.useState<AuthState>(Auth.shared.isAuth);

	const [profile, setProfile] = React.useState<any>(null);

	React.useEffect(() => {
		Auth.shared.subscribe(Events.ON_AUTH_STATE_CHANGE, (newState) => {
			console.log('on auth state change', newState);
			setIsAuth(newState);
		});

		Auth.shared.subscribe(Events.PROFILE_FETCHED, (profile) => {
			setProfile(profile);
		});
	}, []);

	return (
		<>
		
			<div className="topMenu">
				<Box component="nav" sx={{ flexGrow: 1 }}>
					<List role="menubar" orientation="horizontal">
						<ListItem role="none">
							<ListItemButton
								role="menuitem"
								component="a"
								href="/"
								sx={{borderRadius: "sm"}}
							>
								<HomeRounded />
							</ListItemButton>
						</ListItem>
						<ListDivider />
						<ListItem role="none">
							<ListItemButton role="menuitem" component="a" href="/features" sx={{borderRadius: "sm"}}>
								<ListItemDecorator><AutoAwesomeRounded /></ListItemDecorator>
								<ListItemContent>Features</ListItemContent>
							</ListItemButton>
						</ListItem>
						<ListDivider />
						<ListItem role="none">
							<ListItemButton role="menuitem" component="a" href="/docs" sx={{borderRadius: "sm"}}>
								<ListItemDecorator><ArticleRounded /></ListItemDecorator>
								<ListItemContent>Docs</ListItemContent>
							</ListItemButton>
						</ListItem>
						<ListDivider />
						<ListItem role="none">
							<ListItemButton variant="solid" color="primary" role="menuitem" component="a" href="/subscribe" sx={{borderRadius: "sm"}}>
								<ListItemDecorator><SwitchAccessShortcutAddRounded /></ListItemDecorator>
								<ListItemContent>Subscribe</ListItemContent>
							</ListItemButton>
						</ListItem>
						<ListItem role="none" sx={{ marginInlineStart: 'auto' }}>
							{isAuth === AuthState.AUTH ? (
								<ListItemButton variant="soft" role="menuitem" component="a" href="/profile" sx={{borderRadius: "sm"}}>
									<ListItemDecorator sx={{pr: "10px"}}>
										<Skeleton variant="circular" loading={profile === null}>
											{profile !== null && profile.avatar_url && profile.avatar_url !== "" ? (
												<Avatar src={profile.avatar_url} />
											) : (
												<Avatar>{profile !== null ? getInitials(profile.display_name) : "N/A"}</Avatar>
											)}
										</Skeleton>
									</ListItemDecorator>
									<ListItemContent>
										<Skeleton variant="inline" loading={profile === null}>{profile === null ? "Fetching..." : profile.display_name}</Skeleton>
									</ListItemContent>
								</ListItemButton>
							) : (
								<ListItemButton variant="soft" role="menuitem" component="a" href="/auth/login" sx={{borderRadius: "sm"}}>
									<ListItemDecorator sx={{pr: "10px"}}><Avatar><LoginRounded /></Avatar></ListItemDecorator>
									<ListItemContent>Login</ListItemContent>
								</ListItemButton>
							)}
						</ListItem>
						{isAuth === AuthState.AUTH && (
							<>
								<ListDivider />
								<ListItemButton role="menuitem" component="a" href="/uploading" sx={{borderRadius: "sm"}}>
									<ListItemDecorator><UploadFileRounded /></ListItemDecorator>
									<ListItemContent>Upload</ListItemContent>
								</ListItemButton>
								<ListDivider />
								<ListItem role="none">
									<ListItemButton role="menuitem" component="button" sx={{borderRadius: "sm"}} onClick={() => {
										Auth.shared.logout();
									}}>
										<ListItemDecorator><LogoutRounded /></ListItemDecorator>
										<ListItemContent>Logout</ListItemContent>
									</ListItemButton>
								</ListItem>
							</>
						)}
						<ListDivider />
						<ListItem role="none">
							<ListItemButton role="menuitem" component="button" sx={{borderRadius: "sm"}} onClick={() => {
								setMode(mode === 'light' ? 'dark' : 'light')
							}}>
								{mode === 'light' ? <DarkModeRounded></DarkModeRounded> : <LightModeRounded></LightModeRounded>}
							</ListItemButton>
						</ListItem>
					</List>
				</Box>
			</div>
		</>
	);
}