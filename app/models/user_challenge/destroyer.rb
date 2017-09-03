class UserChallenge
  class Destroyer
    attr_reader :challenge, :id, :user_challenge

    def initialize(id:)
      @id = id
    end

    def destroy
      set_user_challenge
      destroy_user_challenge
    end

    private

    def set_user_challenge
      @user_challenge = UserChallenge.includes(challenge: [:users]).find_by(id: id)
      @challenge = user_challenge.challenge
    end

    def destroy_user_challenge
      if challenge.open_spot_challenge_type?
        destroy_open_spot_user_challenge!
      else
        destroy_non_open_spot_user_challenge!
      end

      Result.success
    rescue StandardError
      errors = user_challenge.errors.any? ? user_challenge.errors : challenge.errors
      Result.failure(errors: errors)
    end

    def destroy_open_spot_user_challenge!
      UserChallenge.transaction do
        user_count = challenge.users.count
        user_challenge.destroy!
        challenge.destroy! if user_count <= 1
      end
    end

    def destroy_non_open_spot_user_challenge!
      challenge.destroy!
    end
  end
end
