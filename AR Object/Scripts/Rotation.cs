using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Rotation : MonoBehaviour
{
    public float speed = 10f;
    private bool isRotating;
   
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if (isRotating)
        {
            transform.Rotate(Vector3.up * speed * Time.deltaTime);
        }
    }

    public void PlayButtonClicked()
    {      
        isRotating = true;
    }

    public void PauseButtonClicked()
    {        
        isRotating = false;
    }
}
