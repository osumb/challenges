class UserChallenge < ApplicationRecord
  # associations
  belongs_to :user
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
    user.spot == challenge.spot
  end
end
