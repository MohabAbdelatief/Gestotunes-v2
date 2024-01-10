using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Next : MonoBehaviour
{    
    public AudioSource audioSource;    
    public AudioClip[] songs;    
    private int currentSongIndex = 0;
  
    public Material quadMaterial;
    public Texture[] textures;    
    private int currentTextureIndex = 0;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void ChangeMaterial()
    {
        // Change the texture on the quad material
        quadMaterial.mainTexture = textures[currentTextureIndex];

        // Increment the texture index
        currentTextureIndex = (currentTextureIndex + 1) % textures.Length;
    }

    public void PlayNextSong()
    {
        // Play the next song
        audioSource.clip = songs[currentSongIndex];
        audioSource.Play();

        // Increment the song index
        currentSongIndex = (currentSongIndex + 1) % songs.Length;
    }

    public void ChangeToPreviousMaterial()
    {
        // Decrement the texture index
        currentTextureIndex = (currentTextureIndex - 1 + textures.Length) % textures.Length;

        // Change the texture on the quad material
        quadMaterial.mainTexture = textures[currentTextureIndex];
    }

    public void ChangeToPreviousSong()
    {      
        // Decrement the song index
        currentSongIndex = (currentSongIndex - 1 + songs.Length) % songs.Length;

        // Change the audio clip on the AudioSource
        audioSource.clip = songs[currentSongIndex];

        // Play the new audio clip
        audioSource.Play();
    }
}
