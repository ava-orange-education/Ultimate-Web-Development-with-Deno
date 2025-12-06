import { useSignal } from "@preact/signals";
import Button from "../components/Button.tsx";

export default function CommentForm() {
  const name = useSignal("");
  const comment = useSignal("");
  const isSubmitting = useSignal(false);
  const submittedComments = useSignal<Array<{ name: string, comment: string, timestamp: string }>>([]);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!name.value.trim() || !comment.value.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    isSubmitting.value = true;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Add comment to list
    submittedComments.value = [
      ...submittedComments.value,
      {
        name: name.value,
        comment: comment.value,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    ];

    // Clear form
    name.value = "";
    comment.value = "";
    isSubmitting.value = false;
  };

  return (
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">Leave a comment</h3>

      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            value={name.value}
            onInput={(e) => name.value = e.currentTarget.value}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
          <label for="comment" class="block text-sm font-medium text-gray-700 mb-1">
            Comment *
          </label>
          <textarea
            id="comment"
            placeholder="Your comment..."
            value={comment.value}
            onInput={(e) => comment.value = e.currentTarget.value}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            rows={4}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting.value}
          disabled={isSubmitting.value}
          class="w-full"
        >
          Submit Comment
        </Button>
      </form>

      {submittedComments.value.length > 0 && (
        <div class="mt-8">
          <h4 class="text-lg font-medium text-gray-900 mb-4">Comments ({submittedComments.value.length})</h4>
          <div class="space-y-4">
            {submittedComments.value.map((comment, index) => (
              <div key={index} class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <span class="font-medium text-gray-900">{comment.name}</span>
                  <span class="text-sm text-gray-500">{comment.timestamp}</span>
                </div>
                <p class="text-gray-700">{comment.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
