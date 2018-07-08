class UserChallengeService
  class << self
    def update(user_challenge_hashes:) # rubocop:disable Metrics/MethodLength
      user_challenges = user_challenge_hashes.map { |hash| UserChallenge.find(hash['id']) }

      UserChallenge.transaction do
        user_challenges.each.with_index do |user_challenge, index|
          user_challenge_hash = user_challenge_hashes[index]
          update_params = { comments: user_challenge_hash['comments'], place: user_challenge_hash['place'].to_i }
          user_challenge.update!(update_params)
        end
      end

      Result.success
    rescue StandardError => e
      Result.failure(errors: e.message)
    end
  end
end
