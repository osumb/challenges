class UserChallengeService
  class << self
    def update(user_challenge_hashes:)
      user_challenges = user_challenge_hashes.map { |hash| UserChallenge.find(hash["id"]) }

      UserChallenge.transaction do
        user_challenges.each.with_index do |user_challenge, index|
          user_challenge.update!(user_challenge_hashes[index])
        end
      end

      Result.success
    rescue StandardError => e
      Result.failure(errors: e.message)
    end
  end
end
