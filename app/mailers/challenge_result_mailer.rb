class ChallengeResultMailer < ApplicationMailer
  attr_reader :performance, :result_path

  def completed_email(performance_id:, email:)
    @performance = Performance.find(performance_id)
    @result_path = _url_for_env

    to = _real_email_strategy? ? email : ENV["MAINTAINER_EMAIL"]
    mail(to: to, subject: "OSUMB Challenge Results")
  end
end
