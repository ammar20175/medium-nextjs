import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

interface FormInputs {
	_id: string;
	name: string;
	email: string;
	comment: string;
}

interface Props {
	id: string;
}

function CommentForm({ id }: Props) {
	const [submitted, setSubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInputs>();

	const onSubmit: SubmitHandler<FormInputs> = (data) => {
		fetch("/api/createComment", {
			method: "POST",
			body: JSON.stringify(data),
		})
			.then(() => {
				console.log(data);
				setSubmitted(true);
			})
			.catch((err) => {
				console.log(err);
				setSubmitted(false);
			});
	};

	return (
		<div>
			{submitted ? (
				<div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-5 md:mx-auto">
					<h3 className="text-3xl font-bold mb-2">
						Thank you for submitting your comment
					</h3>

					<p>Once it has been approved, it will appear below!</p>
				</div>
			) : (
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
				>
					<h3 className="text-sm font-semibold text-yellow-500 mb-2">
						Enjoyed this article ?
					</h3>
					<h4 className="text-3xl font-bold">Leave a comment below!</h4>
					<hr className="py-3 mt-2" />

					<input {...register("_id")} type="hidden" value={id} />

					<label className="block mb-5">
						<span className="text-gray-700">Name</span>
						<input
							{...register("name", { required: true })}
							className="input form-input"
							type="text"
							placeholder="John"
						/>
					</label>

					<label className="block mb-5">
						<span className="text-gray-700">Email</span>
						<input
							{...register("email", { required: true })}
							className="input form-input "
							type="text"
							placeholder="John"
						/>
					</label>

					<label className="block mb-5">
						<span className="text-gray-700">Comment</span>
						<textarea
							{...register("comment", { required: true })}
							className="input form-textarea"
							placeholder="Type your comment here"
							rows={8}
						/>
					</label>

					<div className="flex flex-col p-5 text-red-500">
						{errors.name && <span>- Name is required</span>}
						{errors.email && <span>- Email is required</span>}
						{errors.comment && <span>- Comment is required</span>}
					</div>

					<button
						type="submit"
						className="shadow bg-yellow-500 hover:bg-yellow-600 focus:shadow-xl focus:outline-none text-white 
				font-bold py-2 px-4 rounded cursor-pointer"
					>
						Submit
					</button>
				</form>
			)}
		</div>
	);
}

export default CommentForm;
