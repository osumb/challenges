class UsersController < ApplicationController
  before_action :ensure_authenticated!
  before_action :ensure_admin!

  def search # rubocop:disable Metrics/MethodLength
    @users = if params[:query]
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
end
