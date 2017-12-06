module PasswordResetRequestService
  # rubocop:disable Metrics/MethodLength
  def self.send_for_new_user(user:)
    PasswordResetRequest.create(user: user).tap do |password_reset_request|
      if password_reset_request.valid?
        EmailJob.perform_later(
          klass: 'PasswordResetMailer',
          method: 'user_creation_email',
          args: {
            user_buck_id: user.buck_id,
            password_reset_request_id: password_reset_request.id
          }
        )
      else
        Rails.logger.info "USER_LOADER: Error while creating password reset request for #{user.buck_id}"
      end
    end
  end
  # rubocop:enable Metrics/MethodLength
end
