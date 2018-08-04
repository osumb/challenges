class NewPerformanceMailer < ApplicationMailer
  def new_performance_email(performance_id:, email:)
    @performance = Performance.find(performance_id)
    to = _real_email_strategy? ? email : ENV["MAINTAINER_EMAIL"]
    mail(to: to, subject: "[OSUMB Challenges] New Performance")
  end
end
