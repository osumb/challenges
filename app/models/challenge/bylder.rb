# Builder to localize challenge creation logic
class Challenge
  class Bylder
    class << self
      def perform(challenger, performance, spot)
        type = challenge_type_from_spot(spot: spot, performance: performance)
        users = get_users(challenger: challenger, type: type, spot: spot, performance: performance)
        challenge = create_or_update(performance: performance, spot: spot, challenge_type: type, users: users)
        challenge
      end

      private

      def create_or_update(performance:, spot:, challenge_type:, users:)
        challenge = find_challenge(performance: performance, spot: spot)
        if challenge.nil?
          create(performance: performance, spot: spot, challenge_type: challenge_type, users: users)
        else
          update(challenge: challenge, users: users)
        end
      end

      def create(performance:, spot:, challenge_type:, users:)
        challenge = Challenge.new(performance: performance, spot: spot, challenge_type: challenge_type, users: users)
        challenge.user_challenges.each { |uc| uc.spot = uc.user.spot }
        challenge
      end

      def update(challenge:, users:)
        new_user = users.select { |u| !challenge.users.include? u }.first
        challenge.user_challenges.create(user: new_user, spot: new_user.spot)
        challenge
      end

      def challenge_type_from_spot(spot:, performance:)
        spot_user_das = spot.user.discipline_actions.select { |da| da.performance.id == performance.id }
        if Challenge.tri_challenge_rows.include? spot.row.downcase.to_sym
          Challenge.challenge_types[:tri]
        elsif spot_user_das.last&.open_spot
          Challenge.challenge_types[:open_spot]
        else
          Challenge.challenge_types[:normal]
        end
      end

      # rubocop:disable Metrics/MethodLength
      def get_users(challenger:, type:, spot:, performance:)
        users = [challenger]
        if type == Challenge.challenge_types[:normal]
          users << associated_user_for_normal_challenge(spot)
        elsif type == Challenge.challenge_types[:tri]
          users << associated_user_for_tri_challenge(challenger)
        elsif type == Challenge.challenge_types[:open_spot]
          new_user = associated_user_for_open_spot_challenge(spot: spot, performance: performance)
          users << [new_user] unless new_user.nil?
        else
          raise "Unsupported challenge type: #{type}"
        end
        users.flatten
      end
      # rubocop:enable Metrics/MethodLength

      def associated_user_for_normal_challenge(spot)
        spot.user
      end

      def associated_users_for_tri_challenge(challenger, spot)
        regular_user = spot.user
        other_alternate = User.joins('LEFT OUTER JOIN spots on spots.id = users.spot_id').find_by(
          'instrument = ? and part = ? and buck_id != ? and file > 12',
          User.instruments[challenger.instrument],
          User.parts[challenger.part],
          challenger.buck_id
        )
        [regular_user, other_alternate]
      end

      def associated_user_for_open_spot_challenge(spot:, performance:)
        (find_challenge(spot: spot, performance: performance)&.users || []).first
      end

      def find_challenge(spot:, performance:)
        Challenge.find_by(performance: performance, spot: spot)
      end
    end
  end
end
