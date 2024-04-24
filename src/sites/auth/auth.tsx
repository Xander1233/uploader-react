import { Sheet, Stack } from "@mui/joy";
import LoginForm from "./login/login";
import React, { useEffect } from "react";
import { CurrentFlow, Auth as AuthObj, AuthState } from "../../Shares/Auth";
import { Events } from "../../util/EventEmitter";
import RegisterForm from "./register/register";
import { useLocation } from "react-router";
import ResetPasswordForm from "./resetPassword/resetPassword";

export default function Auth() {

	const [flow, setFlow] = React.useState<CurrentFlow>(AuthObj.shared.currentFlow);

	const location = useLocation();

	const [navigateTo, setNavigateTo] = React.useState<string>("/");

	useEffect(() => {
		let searchParams = new URLSearchParams(location.search);

		if (searchParams.has("redirect")) {
			setNavigateTo(searchParams.get("redirect") as string);
		}

		let pathname = location.pathname.split("/");

		if (pathname[pathname.length - 1] === "register") {
			AuthObj.shared.setFlow(CurrentFlow.REGISTER);
			setFlow(CurrentFlow.REGISTER);
		}

		if (pathname[pathname.length - 1] === "passwordreset") {
			AuthObj.shared.setFlow(CurrentFlow.RESET_PASSWORD);
			setFlow(CurrentFlow.RESET_PASSWORD);
		}

		AuthObj.shared.subscribe(Events.ON_AUTH_STATE_CHANGE, (newState) => {
			if (newState === AuthState.AUTH) {
				setNavigateTo("/");
			}
		});

		AuthObj.shared.subscribe(Events.PROFILE_FETCHED, (profile) => {
			setNavigateTo("/");
		});

		AuthObj.shared.subscribe(Events.FLOW_CHANGE, (newFlow) => {
			setFlow(newFlow);
		});
	}, []);

	return (
		<Stack direction={"row"} justifyContent={"center"} alignItems={"start"} sx={{width: "100%", height: "80vh"}} >
			<Stack direction={"column"} justifyContent={"center"} alignItems={"center"} sx={{pt: "10vh", width: "30%", height: "75%"}}>
				<Sheet variant="glass" sx={{mx: "20%", p: 5, width: "80%", borderRadius: "sm"}}>
					{flow === CurrentFlow.LOGIN && <LoginForm redirect={navigateTo} />}
					{flow === CurrentFlow.REGISTER && <RegisterForm redirect={navigateTo} />}
					{flow === CurrentFlow.RESET_PASSWORD && <ResetPasswordForm />}
				</Sheet>
			</Stack>
			<Stack direction={"column"} justifyContent={"center"} alignItems={"center"} sx={{width: "30%"}}>
				<img src="/logo.png" style={{width: "33vw"}} />
			</Stack>
		</Stack>
	);
}