class PerformancesController < ApplicationController
  before_action :ensure_authenticated!
  before_action :ensure_admin!

  def create
    @performance = Performance.create(create_params)
    if @performance.save
      QueueNewPerformanceEmailsJob.perform_later(performance_id: @performance.id)
    else
      flash.now[:errors] = @performance.errors.full_messages
    end
    redirect_to('/performances/new')
  end

  def new; end

  private

  def create_params
    params.require(:performance).permit(
      :name,
      :date,
      :window_close,
      :window_open
    )
  end
end
