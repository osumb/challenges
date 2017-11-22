class NewPerformanceMailer < ApplicationMailer
  def new_performance_email(performance_id:, email:)
    return if Rails.env.test?
    @performance = Performance.find(performance_id)
    to = Rails.env.production? ? email : ENV['MAINTAINER_EMAIL']
    mail(to: to, subject: '[OSUMB Challenges] New Performance')
  end
end
