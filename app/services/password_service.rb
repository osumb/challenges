module PasswordService
  class << self
    def reset_password(password_reset_request_id:, password_digest:)
      request = PasswordResetRequest.includes(:user).find(password_reset_request_id)
      user = request.user
      user.update(password_digest: password_digest, revoke_token_date: Time.now.utc)
      request.update(used: true)

      user.errors.full_messages + request.errors.full_messages
    end

    def encrypt_password(password:)
      BCrypt::Password.create(password)
    end
  end
end
