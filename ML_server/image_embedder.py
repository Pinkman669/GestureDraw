import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

def image_embedding(submitted_image,challenge_image):
    # IMAGE_FILENAMES = [submitted_image, challenge_image]

    # Create options for Image Embedder
    base_options = python.BaseOptions(model_asset_path='./model/mobilenet_v3_small_075_224_embedder.tflite')
    l2_normalize = True #@param {type:"boolean"}
    quantize = True #@param {type:"boolean"}
    options = vision.ImageEmbedderOptions(
    base_options=base_options, l2_normalize=l2_normalize, quantize=quantize)


    # Create Image Embedder
    with vision.ImageEmbedder.create_from_options(options) as embedder:
        
        # Format images for MediaPipe
        challenge_image_formatted = mp.Image.create_from_file(challenge_image)
        submitted_image_formatted = mp.Image(image_format= mp.ImageFormat.SRGB, data=submitted_image)
        first_embedding_result = embedder.embed(submitted_image_formatted)
        second_embedding_result = embedder.embed(challenge_image_formatted)

        # Calculate and print similarity
        similarity = vision.ImageEmbedder.cosine_similarity(
        first_embedding_result.embeddings[0],
        second_embedding_result.embeddings[0])

    return(similarity)




