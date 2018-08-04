class UsersController < ApplicationController
  before_action :ensure_authenticated!
  before_action :ensure_admin!
  before_action :ensure_switch_spot_exists!, only: [:switch_spot]

  def index
    row = params[:row].downcase unless Spot.rows[params[:row]&.downcase].nil?
    row ||= Spot.rows.keys.min

    @users = Spot.includes(:current_user, :original_user)
                 .where(row: row)
                 .map(&:current_user)
                 .select(&:performer?)
                 .sort_by(&:current_spot)
  end

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

  # rubocop:disable Metrics/MethodLength
  def show
    @user = User.includes(:challenges, :discipline_actions).find(params[:id])
    @performance = Performance.next
    @current_challenge = @user.challenges.where(performance: @performance).first
    @past_challenges = @user.challenges.done.where.not(performance: @performance).order(id: :desc)
    @current_discipline_action = @user.discipline_actions.where(performance: @performance).first
    @past_discipline_actions = @user.discipline_actions.where.not(performance: @performance).order(id: :desc)
    if params[:switch_spot]
      flash_hash = get_spot_switch_flash(params[:switch_spot], @user)
      flash.now[flash_hash.keys.first.to_sym] = flash_hash.values.first
      @show_switch_submit_button = flash_hash[:switch_message].present?
    else
      @show_switch_submit_button = false
    end
  end

  def switch_spot
    user = User.find(params[:id])
    spot = SpotService.find(query: params[:spot])
    other_user = spot.current_user
    result = UserService.switch_spots(first_user: user, second_user: other_user)
    flash_hash = if result.success?
                   { message: I18n.t!('client_messages.users.switch_spot.success') }
                 else
                   { errors: result.errors }
                 end
    redirect_to("/users/#{user.buck_id}", flash: flash_hash)
  end

  def upload; end

  def new; end

  def create
    result = UserCreationService.create_user(params: create_params)

    flash_hash = if result.success?
                   PasswordResetRequestService.send_for_new_user(user: result.user)
                   { message: I18n.t!('client_messages.users.create.success') }
                 else
                   { errors: result.errors }
                 end
    send_back(flash_hash)
  end

  private

  # rubocop:disable Metrics/LineLength
  def get_spot_switch_flash(switch_spot, user)
    spot = SpotService.find(query: switch_spot)
    return { switch_error: I18n.t!('client_messages.users.show.spot_switch_malformed', spot: switch_spot) } if spot.nil?
    row = Spot.rows[spot.row]
    instrument = User.instruments[user.instrument]
    part = User.parts[user.part]
    if !Spot.valid_instrument_part_for_row(row, instrument, part)
      { switch_error: I18n.t!('client_messages.users.show.spot_switch_invalid', name: user.first_name, spot: switch_spot) }
    else
      other_user = spot.current_user
      { switch_message: I18n.t!('client_messages.users.show.spot_switch_message', name: other_user.full_name, spot: switch_spot) }
    end
  end
  # rubocop:enable Metrics/MethodLength, Metrics/LineLength

  def create_params
    params.require(:user).permit(:first_name,
                                 :last_name,
                                 :email,
                                 :buck_id,
                                 :instrument,
                                 :part,
                                 :role,
                                 :spot)
  end

  def update_params
    params.require(:user).permit(:part)
  end

  def ensure_switch_spot_exists!
    spot = SpotService.find(query: params[:spot])
    return if spot.present?
    head :not_found
  end
end
