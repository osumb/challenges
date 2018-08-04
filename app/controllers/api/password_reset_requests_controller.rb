module Api
  class PasswordResetRequestsController < ApiController
    # rubocop:disable Metrics/MethodLength
    def create
      @user = User.find_by buck_id: params[:buck_id]&.downcase
      unless !@user.nil? && @user.email == params[:email]&.downcase
        head 403
        return
      end
      @prr = PasswordResetRequest.new user: @user
      # We're reloading because prr.expires is a default value created in the db. Unfortunately, it doesn't get returned
      if @prr.save && @prr.reload
        render :create, status: :created
        _send_email
      else
        render json: { resource: "PasswordResetRequest", errors: @prr.errors }, status: :conflict
      end
    end
    # rubocop:enable Metrics/MethodLength

    def show
      @prr = PasswordResetRequest.includes(:user).find params[:id]
    end

    private

    def _send_email
      EmailJob.perform_later(
        klass: PasswordResetMailer.to_s,
        method: "password_reset_email",
        args: {
          user_buck_id: @user.buck_id,
          password_reset_request_id: @prr.id
        }
      )
    end
  end
end
