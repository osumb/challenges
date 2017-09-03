class DisciplineActionsController < ApplicationController
  before_action :authenticate_user
  before_action :ensure_admin!
  before_action :ensure_performance_is_not_expired!
  before_action :ensure_spot_hasnt_been_challenged!, except: [:create]

  def create
    @da = DisciplineAction.new create_params
    if @da.save
      render :show, status: 201
    else
      render json: { resource: 'discipline_action', errors: @da.errors }, status: 409
    end
  end

  def destroy
    DisciplineAction.find(params[:id]).destroy
  end

  private

  def create_params
    params.require(:discipline_action).permit(
      :allowed_to_challenge,
      :open_spot,
      :performance_id,
      :reason,
      :user_buck_id
    )
  end

  def ensure_performance_is_not_expired!
    p = Performance.find_by id: params[:discipline_action][:performance_id]
    p = DisciplineAction.find_by(id: params[:id])&.performance if p.nil?
    return if !p.nil? && !p.stale?
    render json: { resource: 'discipline_action', errors: [{ performance: 'can\'t be expired' }] }, status: 403
  end

  # rubocop:disable Metrics/LineLength
  def ensure_spot_hasnt_been_challenged!
    da = DisciplineAction.find params[:id]
    user = da.user
    user_spot = user.spot
    performance = da.performance
    challenges = Challenge.where(performance: performance, spot: user_spot)
    return if challenges.empty?
    render json: {
      resource: 'discipline_action',
      errors: [{ discipline_action: "#{user.first_name} #{user.last_name}'s spot has already been challenged. Please remove that challenge before deleting this discipline action." }]
    }, status: 403
  end
  # rubocop:enable Metrics/LineLength
end
