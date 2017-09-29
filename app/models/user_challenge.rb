class UserChallenge < ApplicationRecord
  # enums
  enum place: { first: 1, second: 2, third: 3 }, _suffix: true

  # associations
  belongs_to :user, foreign_key: 'user_buck_id'
  belongs_to :challenge
  belongs_to :spot

  def self.can_user_remove_self_from_challenge?(user, challenge, user_challenge)
    return false if challenge.users.none? { |u| u.id == user.id }
    return false if user_challenge.user.id != user.id
    return true if challenge.open_spot_challenge_type?
    !user_being_challenged? user, challenge
  end

  # for non open spot challenges only
  def self.user_being_challenged?(user, challenge)
    return false if user.alternate?
    user.current_spot == challenge.spot
  end
end
