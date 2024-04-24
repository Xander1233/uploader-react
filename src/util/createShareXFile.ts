import { Globals } from "./Globals";

const template = `{
	"Version": "13.3.0",
	"Name": "SparkCloud CDN",
	"DestinationType": "ImageUploader",
	"RequestMethod": "POST",
	"RequestURL": "${Globals.shared.API_BASE_URL}api/uploads",
	"Headers": {
		"Authorization": "Bearer {{ uploadToken }}"
	},
	"Body": "MultipartFormData",
	"Arguments": {
		"private": "false",
		"password": "",
	},
	"FileFormName": "file",
	"URL": "$json:url$"
}`;

export function createShareXFile(uploadToken: string) {
	const shareXFile = template.replace("{{ uploadToken }}", uploadToken);
	return shareXFile;
}