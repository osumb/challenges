class Challenge < ApplicationRecord
  # enums
  enum challenge_type: [:open_spot, :normal, :tri], _suffix: true
  enum stage: [:needs_comments, :needs_approval, :done], _suffix: true

  # associations
  has_many :user_challenges
  has_many :users, through: :user_challenges
  belongs_to :spot
  belongs_to :performance
  belongs_to :winner, class_name: 'User', foreign_key: 'winner_id'

  # validations
  validates :performance, presence: true
end
