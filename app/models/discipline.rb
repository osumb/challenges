class Discipline < ApplicationRecord
  # associations
  belongs_to :user
  belongs_to :performance

  # validations
  validates :reason, presence: true
  validates :open_spot, presence: true
  validates :allowed_to_challenge, presence: true
end