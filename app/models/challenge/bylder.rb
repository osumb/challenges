# Builder to localize challenge creation logic
class Challenge
  class Bylder
    class << self
      def perform(challenger, performance, spot)
        type = challenge_type_from_spot(spot, performance)
        users = get_users(challenger, type, spot)
        challenge = Challenge.new(performance: performance, spot: spot, challenge_type: type, users: users)
        challenge.user_challenges.each { |uc| uc.spot = uc.user.spot }
        challenge
      end

      private

      def challenge_type_from_spot(spot, performance)
        spot_user_das = spot.user.discipline_actions.select { |da| da.performance.id == performance.id }
        if Challenge.tri_challenge_rows.include? spot.row.downcase.to_sym
          Challenge.challenge_types[:tri]
        elsif spot_user_das.last&.open_spot
          Challenge.challenge_types[:open_spot]
        else
          Challenge.challenge_types[:normal]
        end
      end

      def get_users(challenger, type, spot)
        users = [challenger]
        if type == Challenge.challenge_types[:normal]
          users << associated_user_for_normal_challenge(spot)
        elsif type == Challenge.challenge_types[:tri]
          users << associated_user_for_tri_challenge(challenger)
        end
        users.flatten
      end

      def associated_user_for_normal_challenge(spot)
        spot.user
      end

      def associated_user_for_tri_challenge(challenger)
        User.includes(:spot).where(
          'instrument = ? and part = ? and buck_id != ?',
          User.instruments[challenger.instrument],
          User.parts[challenger.part],
          challenger.buck_id
        )
      end
    end
  end
end
