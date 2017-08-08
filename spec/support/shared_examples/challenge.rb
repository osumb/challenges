shared_examples_for 'a valid transition to :needs_approval' do |challenge_factory|
  let(:challenge) { create(challenge_factory, stage: :needs_comments) }

  context 'when there is a first, second, and possibly third place' do
    before do
      challenge.user_challenges.each_with_index do |uc, index|
        uc.update(place: index + 1)
      end
    end

    it 'is allowed to transition to :needs_approval' do
      expect { challenge.update(stage: :needs_approval) }
        .to change { challenge.reload.stage }.to('needs_approval')
    end
  end

  context 'when there are overlapping places' do
    before do
      challenge.user_challenges.each do |uc|
        uc.update(place: 1)
      end
    end

    it 'is not allowed to transition to :needs_approval' do
      expect { challenge.update(stage: :needs_approval) }
        .not_to change { challenge.reload.stage }
    end

    it 'has the correct errors' do
      challenge.update(stage: :needs_approval)

      expect(challenge.errors.full_messages).to include('Challenge cannot have duplicate place assignments')
    end
  end

  context 'when there are missing places' do
    before do
      challenge.user_challenges.each do |uc|
        uc.update(place: nil)
      end
    end

    it 'is not allowed to transition to :needs_approval' do
      expect { challenge.update(stage: :needs_approval) }
        .not_to change { challenge.reload.stage }
    end

    it 'has the correct errors' do
      challenge.update(stage: :needs_approval)

      expect(challenge.errors.full_messages).to include('Challenge must have place assignments')
    end
  end

  if challenge_factory != :tri_challenge
    context 'when there is only a second and third place' do
      before do
        challenge.user_challenges.each_with_index do |uc, index|
          uc.update(place: index + 2)
        end
      end

      it 'is not allowed to transition to :needs_approval' do
        expect { challenge.update(stage: :needs_approval) }
          .not_to change { challenge.reload.stage }
      end

      it 'has the correct errors' do
        challenge.update(stage: :needs_approval)

        expect(challenge.errors.full_messages).to include('Challenge cannot have a third place unless the challenge is a tri challenge')
      end
    end
  end
end
