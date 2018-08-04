class ApplicationMailer < ActionMailer::Base
  default from: "osumbit@gmail.com"
  layout "mailer"

  private

  def _real_email_strategy?
    ENV["EMAIL_STRATEGY"] == "real"
  end

  def _url_for_env(path = "")
    "#{ENV['APPLICATION_URL']}/#{path}"
  end
end
