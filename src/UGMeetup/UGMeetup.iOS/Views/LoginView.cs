using System;
using MonoTouch.UIKit;
using System.Drawing;

namespace UGMeetup.iOS
{
	public class LoginView : UIView
	{
		UIImageView image;
		UIButton loginButton;
		public LoginView ()
		{

			BackgroundColor = UIColor.White;
			string pngFileName = "Default";

			if(UIScreen.MainScreen.Bounds.Height > 480)
				pngFileName+= "-568h@2x";

			image = new UIImageView (UIImage.FromBundle (pngFileName));

			image.Frame = UIScreen.MainScreen.Bounds;

			// facebook login button code ported from FB iOS SDK :
			// https://github.com/facebook/facebook-ios-sdk/blob/master/src/FBLoginView.m 

			UIEdgeInsets imageInsets = new UIEdgeInsets(4.0f, 40.0f, 4.0f, 4.0f);

			loginButton = UIButton.FromType (UIButtonType.Custom);
			var loginImage = UIImage.FromBundle ("FBLoginViewButton").CreateResizableImage (imageInsets);
			loginButton.SetBackgroundImage (loginImage, UIControlState.Normal);

			loginImage = UIImage.FromBundle ("FBLoginViewButtonPressed").CreateResizableImage (imageInsets);
			loginButton.SetBackgroundImage (loginImage, UIControlState.Highlighted);

			UIFont font = UIFont.FromName("HelveticaNeue-Bold", 14.0f);
			string loginText = "Log in with Facebook";
			float loginTextWidth =  this.StringSize(loginText, font).Width;

			// We make the button big enough to hold the image, the text, the padding to the right of the f and the end cap
			var g_buttonSize = new SizeF(loginImage.Size.Width + loginTextWidth + 20 , loginImage.Size.Height);

			var buttonFrame = new RectangleF ( new PointF(60, 350), g_buttonSize);
			loginButton.Frame = buttonFrame;

			buttonFrame = new RectangleF(loginImage.Size.Width + 45 , 350, g_buttonSize.Width - (loginImage.Size.Width - 10) - 10, loginImage.Size.Height);

			var loginLabel = new UILabel (buttonFrame);
			loginLabel.Text = loginText;
			loginLabel.Font = font;
			loginLabel.BackgroundColor = UIColor.Clear;
			loginLabel.TextAlignment = UITextAlignment.Center;
			loginLabel.TextColor = UIColor.White;

			this.Add (image);
			this.Add (loginButton);
			this.Add (loginLabel);
		}


	}
}

