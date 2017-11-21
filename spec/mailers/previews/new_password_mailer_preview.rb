# Preview all emails at http://localhost:3001/rails/mailers/new_password_email
class NewPasswordMailerPreview < ActionMailer::Preview
  def new_performance_email
    NewPerformanceMailer.new_performance_email(
      performance_id: Performance.first.id,
      email: 'fake_email@example.com'
    )
  end
end
