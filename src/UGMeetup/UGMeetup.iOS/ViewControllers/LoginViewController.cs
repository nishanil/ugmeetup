using System;
using MonoTouch.UIKit;

namespace UGMeetup.iOS
{
	public class LoginViewController : UIViewController
	{
		UIView contentView;
		LoginView loginView;
		public LoginViewController ()
		{
			loginView = new LoginView ();
			loginView.Frame = View.Bounds;
			View.Add (loginView);
		}
//		public override void ViewDidLayoutSubviews ()
//		{
//			//contentView.Frame = View.Bounds;
//		}
//
//		public override void LoadView ()
//		{
//			base.LoadView ();
//			loginView = new LoginView ();
//
//			View.Add (contentView = loginView);
//		}
	}
}

