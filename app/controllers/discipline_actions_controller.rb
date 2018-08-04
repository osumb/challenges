class DisciplineActionsController < ApplicationController
  before_action :ensure_authenticated!
  before_action :ensure_admin!
  before_action :ensure_performance_is_not_expired!
  before_action :ensure_user_spot_has_not_made_challenge!, only: [:destroy]

  def create
    discipline_action = DisciplineAction.new(create_params)
    flash = if discipline_action.save
              { message: I18n.t!("client_messages.discipline_actions.create.success") }
            else
              { errors: discipline_action.errors.full_messages.join(",") }
            end
    send_back(flash)
  end

  def destroy
    discipline_action = DisciplineAction.find(params[:id])
    flash = if discipline_action.destroy
              { message: I18n.t!("client_messages.discipline_actions.destroy.success") }
            else
              { errors: discipline_action.errors.full_messages.join(",") }
            end
    send_back(flash)
  end

  private

  def ensure_performance_is_not_expired!
    performance = if params[:discipline_action].present?
                    Performance.find(params[:discipline_action][:performance_id])
                  else
                    DisciplineAction.find(params[:id]).performance
                  end
    return if performance.window_open?
    send_back(errors: I18n.t!("client_messages.discipline_actions.create.stale_performance"))
  end

  def ensure_user_spot_has_not_made_challenge!
    discipline_action = DisciplineAction.find params[:id]
    user = discipline_action.user
    user_spot = user.current_spot
    performance = discipline_action.performance
    challenges = Challenge.where(performance: performance, spot: user_spot)
    return if challenges.empty?
    send_back(errors: I18n.t!("client_messages.discipline_actions.destroy.spot_challenged", name: user.first_name))
  end

  def create_params # rubocop:disable Metrics/MethodLength
    p = params.require(:discipline_action).permit(
      :allowed_to_challenge,
      :open_spot,
      :performance_id,
      :reason,
      :user_buck_id
    )
    %i[open_spot allowed_to_challenge].each do |key|
      next unless p[key] == "on"
      p[key] = true
    end
    p
  end
end
