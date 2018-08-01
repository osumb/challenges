class UsersController < ApplicationController
  before_action :ensure_authenticated!
  before_action :ensure_admin!

  def update
    user = User.find(params[:id])
    user.update(update_params)
    flash = if user.save
              { message: I18n.t!('client_messages.users.update.success') }
            else
              { errors:  user.errors.full_messages.join(',') }
            end
    send_back(flash)
  end

  def search # rubocop:disable Metrics/MethodLength
    @users = if params[:query] && params[:query] != ''
               query = params[:query].downcase
               names = query.split(' ')
               User.performers.where(
                 'lower(first_name) LIKE ? OR lower(last_name) LIKE ?',
                 "%#{names.first}%",
                 "%#{names.last}%"
               )
             else
               []
             end
  end

  def show
    @user = User.includes(:challenges, :discipline_actions).find(params[:id])
    @performance = Performance.next
    @current_challenge = @user.challenges.where(performance: @performance).first
    @past_challenges = @user.challenges.done.where.not(performance: @performance).order(id: :desc)
    @current_discipline_action = @user.discipline_actions.where(performance: @performance).first
    @past_discipline_actions = @user.discipline_actions.where.not(performance: @performance).order(id: :desc)
  end

  private

  def update_params
    params.require(:user).permit(:part)
  end
end
