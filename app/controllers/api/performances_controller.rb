module Api
  class PerformancesController < ApiController
    before_action :authenticate_user
    before_action :ensure_admin!, except: [:challengeable_users]
    before_action :ensure_performance_not_stale!, only: %i[update destroy]
    before_action :ensure_performance_is_unused!, only: [:destroy]

    def create
      @performance = Performance.new create_params
      if @performance.save
        QueueNewPerformanceEmailsJob.perform_later(performance_id: @performance.id)
        render :show, status: :created
      else
        render json: { resource: "performance", errors: @performance.errors }, status: :conflict
      end
    end

    def next
      @performance = Performance.next
    end

    def index
      @performances = Performance.all.order window_open: :asc
    end

    def update
      @performance = Performance.find params[:id]
      @performance.update update_params
      if @performance.save
        render :show, status: :ok
      else
        render json: { resource: "performance", errors: @performance.errors }, status: :conflict
      end
    end

    def destroy
      @performance = Performance.find params[:id]
      if @performance.destroy
        head 204
      else
        render json: { resource: "performance", errors: @performance.errors }, status: :conflict
      end
    end

    def challengeable_users
      user = current_user.admin? ? User.find(params[:user_buck_id]&.downcase) : current_user
      result = ChallengeOptionsService.find_for_user(user: user)
      @users = result.challenge_options
      @performance = result.next_performance
    end

    def challenge_list
      PerformanceService.email_challenge_list(performance_id: params[:id].to_i)
    end

    private

    def create_params
      params.require(:performance).permit(
        :date,
        :name,
        :window_close,
        :window_open
      )
    end

    def update_params
      create_params
    end

    def ensure_performance_not_stale!
      p = Performance.find(params[:id])
      return unless p.stale?
      render json: {
        resource: "performance", errors: [performance: "Performance can't be updated because the window is closed"]
      }, status: :forbidden
    end

    def ensure_performance_is_unused! # rubocop:disable Metrics/MethodLength
      performance = Performance.includes(:challenges, :discipline_actions).find params[:id]
      return if performance.challenges.empty? && performance.discipline_actions.empty?
      render json: {
        resource: "performance",
        errors: [
          {
            performance: "There are already challenges or
            discipline actions made for the #{performance.name} so it can't be deleted"
          }
        ]
      }, status: :forbidden
    end
  end
end
