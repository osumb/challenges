class PerformancesController < ApplicationController
  before_action :authenticate_user
  before_action :ensure_admin!, except: [:challengeable_users]
  before_action :ensure_performance_not_stale!, only: %i[update destroy]
  before_action :ensure_performance_is_unused!, only: [:destroy]

  def create
    @performance = Performance.new create_params
    if @performance.save
      render :show, status: 201
    else
      render json: { resource: 'performance', errors: @performance.errors }, status: 409
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
    @performance.update_attributes update_params
    if @performance.save
      render :show, status: 200
    else
      render json: { resource: 'performance', errors: @performance.errors }, status: 409
    end
  end

  def destroy
    @performance = Performance.find params[:id]
    if @performance.destroy
      head 204
    else
      render json: { resource: 'performance', errors: @performance.errors }, status: 409
    end
  end

  # rubocop:disable Metrics/MethodLength
  def challengeable_users
    user = current_user.admin? ? User.find(params[:user_buck_id]&.downcase) : current_user
    next_performance = Performance.next
    if user.can_challenge_for_performance? next_performance
      query_string = Rails.root.join('lib', 'sql', 'performance', 'challengeable_users.sql').read
      params = {
        performance_id: next_performance.id,
        buck_id: user.buck_id,
        instrument: User.instruments[user.instrument],
        part: User.parts[user.part]
      }
      query = query_string % params
      @users = parse_challengeable_users(ActiveRecord::Base.connection.exec_query(query))
      @performance = next_performance
    else
      @users = []
    end
  end
  # rubocop:enable Metrics/MethodLength

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
    p = Performance.find params[:id]
    return unless p.stale?
    render json: {
      resource: 'performance', errors: [performance: 'Performance can\'t be updated because the window is closed']
    }, status: 403
  end

  def parse_challengeable_users(result)
    column_index_hash = get_column_index_hash(result.columns)
    result.rows.map { |user| parse_challengeable_user(user, column_index_hash) }
  end

  # rubocop:disable Metrics/MethodLength
  def parse_challengeable_user(user, column_index_hash)
    {
      buck_id: user[column_index_hash[:buck_id]],
      challenge_id: user[column_index_hash[:challenge_id]],
      challenge_type: user[column_index_hash[:challenge_type]],
      file: user[column_index_hash[:file]],
      first_name: user[column_index_hash[:first_name]],
      last_name: user[column_index_hash[:last_name]],
      members_in_challenge: user[column_index_hash[:members_in_challenge]],
      open_spot: user[column_index_hash[:open_spot]],
      row: user[column_index_hash[:row]]
    }
  end
  # rubocop:enable Metrics/MethodLength

  # rubocop:disable Metrics/MethodLength
  def get_column_index_hash(columns)
    {
      buck_id: columns.index('buck_id'),
      challenge_id: columns.index('challenge_id'),
      challenge_type: columns.index('challenge_type'),
      file: columns.index('file'),
      first_name: columns.index('first_name'),
      last_name: columns.index('last_name'),
      members_in_challenge: columns.index('members_in_challenge'),
      open_spot: columns.index('open_spot'),
      row: columns.index('row')
    }
  end

  def ensure_performance_is_unused!
    performance = Performance.includes(:challenges, :discipline_actions).find params[:id]
    return if performance.challenges.empty? && performance.discipline_actions.empty?
    render json: {
      resource: 'performance',
      errors: [
        {
          performance: "There are already challenges or
          discipline actions made for the #{performance.name} so it can't be deleted"
        }
      ]
    }, status: 403
  end
  # rubocop:enable Metrics/MethodLength
end
