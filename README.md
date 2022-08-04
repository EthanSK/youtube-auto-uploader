# youtube-auto-uploader

Automatically schedule &amp; upload videos from a folder on your computer to YouTube, with a bunch of configuration options

Ensures videos uploaded haven't already been uploaded (by checking file name).

Check out the `template.env` file for configuration options, and copy to a `.env` file to provide your own configuration.

### Obtaining OAuth credentials

You need to have a GCP project where you can create OAuth credentials. Then add your main email address for your youtube account as a test user in the OAuth consent screen tab. Add `https://developers.google.com/oauthplayground` as a redirect URI, then go to `https://developers.google.com/oauthplayground/`, enter your client id and secret at the bottom of the settings cog dropdown in the upper right corner.
Then select the `https://www.googleapis.com/auth/youtube` and `https://www.googleapis.com/auth/youtube.upload` scopes, authorize and select your youtube account. Then obtain the refresh token in the next step, and copy that, along with the client id and secret, into the `.env` file you created here.
