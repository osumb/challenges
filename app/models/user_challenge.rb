class UserChallenge < ApplicationRecord
  # associations
  belongs_to :user
  belongs_to :challenge
  belongs_to :spot
end
