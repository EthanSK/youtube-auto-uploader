# youtube-auto-uploader

Automatically schedule &amp; upload videos from a folder on your computer to YouTube, with a bunch of configuration options
Will only upload videos that haven't been uploaded to channel yet (by checking the file name i.e. video title)

## Instructions

- Make sure you have NodeJS installed
- Set up project with `npm install`
- Copy the `template.env` to a `.env` file, and replace all the fields with proper values
- Run with `npm run build-and-run`
- If it stops working, try getting a new refresh token

## Obtaining OAuth credentials

You need to have a GCP project where you can create OAuth credentials. Then add your main email address for your youtube account as a test user in the OAuth consent screen tab. Add `https://developers.google.com/oauthplayground` as a redirect URI, then go to `https://developers.google.com/oauthplayground/`, enter your client id and secret at the bottom of the settings cog dropdown in the upper right corner.
Then select the `https://www.googleapis.com/auth/youtube` and `https://www.googleapis.com/auth/youtube.upload` scopes, authorize and select your youtube account. Then obtain the refresh token in the next step, and copy that, along with the client id and secret, into the `.env` file you created here.

https://stackoverflow.com/questions/19766912/how-do-i-authorise-an-app-web-or-installed-without-user-intervention/19766913#19766913

https://stackoverflow.com/a/66292541/6820042

## Notes

The title of video will just be the file name without the extension.
