
using System;
using System.Drawing;
using System.Windows.Forms;
using System.ComponentModel;
using System.Collections.Generic;
using System.Collections;
using System.Threading;
using TUIO;

using System.Net;
using System.Net.Sockets;
using System.Text;
using WebSocketSharp;

public class TuioDemo : Form, TuioListener
{
    private TuioClient client;
    private Dictionary<long, TuioObject> objectList;
    private Dictionary<long, TuioCursor> cursorList;
    private Dictionary<long, TuioBlob> blobList;

    public static int width, height;
    private int window_width = 640;
    private int window_height = 480;
    private int window_left = 0;
    private int window_top = 0;
    private int screen_width = Screen.PrimaryScreen.Bounds.Width;
    private int screen_height = Screen.PrimaryScreen.Bounds.Height;

    private bool fullscreen;
    private bool verbose;

    Font font = new Font("Arial", 10.0f);
    SolidBrush fntBrush = new SolidBrush(Color.White);
    SolidBrush bgrBrush = new SolidBrush(Color.FromArgb(0, 0, 64));
    SolidBrush curBrush = new SolidBrush(Color.FromArgb(192, 0, 192));
    SolidBrush objBrush = new SolidBrush(Color.FromArgb(64, 0, 0));
    SolidBrush blbBrush = new SolidBrush(Color.FromArgb(64, 64, 64));
    Pen curPen = new Pen(new SolidBrush(Color.Blue), 1);

    //Bitmap markerImage = new Bitmap("0.jpg");
    public int flag = 0;

    public int playflag = 0;
    public int pauseflag = 0;
    public int nextflag = 0;
    public int prevflag = 0;

    public string user;
    public int userId = 0;

    private WebSocket pythonSocket;
    //private Socket pythonSocket;

    public TuioDemo(int port)
    {

        verbose = false;
        fullscreen = false;
        width = window_width;
        height = window_height;

        this.ClientSize = new System.Drawing.Size(width, height);
        this.Name = "TuioDemo";
        this.Text = "TuioDemo";

        this.Closing += new CancelEventHandler(Form_Closing);
        this.KeyDown += new KeyEventHandler(Form_KeyDown);

        this.SetStyle(ControlStyles.AllPaintingInWmPaint |
                        ControlStyles.UserPaint |
                        ControlStyles.DoubleBuffer, true);

        objectList = new Dictionary<long, TuioObject>(128);
        cursorList = new Dictionary<long, TuioCursor>(128);
        blobList = new Dictionary<long, TuioBlob>(128);

        //pythonSocket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
        //pythonSocket.Connect("127.0.0.1", 1234);

        pythonSocket = new WebSocket("ws://localhost:1234");
        pythonSocket.Connect();

        client = new TuioClient(port);
        client.addTuioListener(this);

        client.connect();
    }

    private void Form_KeyDown(object sender, System.Windows.Forms.KeyEventArgs e)
    {

        if (e.KeyData == Keys.F1)
        {
            if (fullscreen == false)
            {

                width = screen_width;
                height = screen_height;

                window_left = this.Left;
                window_top = this.Top;

                this.FormBorderStyle = FormBorderStyle.None;
                this.Left = 0;
                this.Top = 0;
                this.Width = screen_width;
                this.Height = screen_height;

                fullscreen = true;
            }
            else
            {

                width = window_width;
                height = window_height;

                this.FormBorderStyle = FormBorderStyle.Sizable;
                this.Left = window_left;
                this.Top = window_top;
                this.Width = window_width;
                this.Height = window_height;

                fullscreen = false;
            }
        }
        else if (e.KeyData == Keys.Escape)
        {
            this.Close();

        }
        else if (e.KeyData == Keys.V)
        {
            verbose = !verbose;
        }

    }

    private void Form_Closing(object sender, System.ComponentModel.CancelEventArgs e)
    {
        client.removeTuioListener(this);

        client.disconnect();
        System.Environment.Exit(0);
    }

    public void addTuioObject(TuioObject o)
    {
        lock (objectList)
        {
            objectList.Add(o.SessionID, o);
        }
        if (verbose) Console.WriteLine("add obj " + o.SymbolID + " (" + o.SessionID + ") " + o.X + " " + o.Y + " " + o.Angle);
    }

    public void updateTuioObject(TuioObject o)
    {

        if (verbose) Console.WriteLine("set obj " + o.SymbolID + " " + o.SessionID + " " + o.X + " " + o.Y + " " + o.Angle + " " + o.MotionSpeed + " " + o.RotationSpeed + " " + o.MotionAccel + " " + o.RotationAccel);
    }

    public void removeTuioObject(TuioObject o)
    {
        lock (objectList)
        {
            objectList.Remove(o.SessionID);
        }
        if (verbose) Console.WriteLine("del obj " + o.SymbolID + " (" + o.SessionID + ")");
    }

    public void addTuioCursor(TuioCursor c)
    {
        lock (cursorList)
        {
            cursorList.Add(c.SessionID, c);
        }
        if (verbose) Console.WriteLine("add cur " + c.CursorID + " (" + c.SessionID + ") " + c.X + " " + c.Y);
    }

    public void updateTuioCursor(TuioCursor c)
    {
        if (verbose) Console.WriteLine("set cur " + c.CursorID + " (" + c.SessionID + ") " + c.X + " " + c.Y + " " + c.MotionSpeed + " " + c.MotionAccel);
    }

    public void removeTuioCursor(TuioCursor c)
    {
        lock (cursorList)
        {
            cursorList.Remove(c.SessionID);
        }
        if (verbose) Console.WriteLine("del cur " + c.CursorID + " (" + c.SessionID + ")");
    }

    public void addTuioBlob(TuioBlob b)
    {
        lock (blobList)
        {
            blobList.Add(b.SessionID, b);
        }
        if (verbose) Console.WriteLine("add blb " + b.BlobID + " (" + b.SessionID + ") " + b.X + " " + b.Y + " " + b.Angle + " " + b.Width + " " + b.Height + " " + b.Area);
    }

    public void updateTuioBlob(TuioBlob b)
    {

        if (verbose) Console.WriteLine("set blb " + b.BlobID + " (" + b.SessionID + ") " + b.X + " " + b.Y + " " + b.Angle + " " + b.Width + " " + b.Height + " " + b.Area + " " + b.MotionSpeed + " " + b.RotationSpeed + " " + b.MotionAccel + " " + b.RotationAccel);
    }

    public void removeTuioBlob(TuioBlob b)
    {
        lock (blobList)
        {
            blobList.Remove(b.SessionID);
        }
        if (verbose) Console.WriteLine("del blb " + b.BlobID + " (" + b.SessionID + ")");
    }

    public void refresh(TuioTime frameTime)
    {
        Invalidate();
    }
    int CurrentState = 0;
    String CurrentUser = "";
    protected override void OnPaintBackground(PaintEventArgs pevent)
    {
        // Getting the graphics object
        Graphics g = pevent.Graphics;
        g.FillRectangle(bgrBrush, new Rectangle(0, 0, width, height));

        // draw the cursor path
        if (cursorList.Count > 0)
        {
            lock (cursorList)
            {
                foreach (TuioCursor tcur in cursorList.Values)
                {
                    List<TuioPoint> path = tcur.Path;
                    TuioPoint current_point = path[0];

                    for (int i = 0; i < path.Count; i++)
                    {
                        TuioPoint next_point = path[i];
                        g.DrawLine(curPen, current_point.getScreenX(width), current_point.getScreenY(height), next_point.getScreenX(width), next_point.getScreenY(height));
                        current_point = next_point;
                    }
                    g.FillEllipse(curBrush, current_point.getScreenX(width) - height / 100, current_point.getScreenY(height) - height / 100, height / 50, height / 50);
                    g.DrawString(tcur.CursorID + "", font, fntBrush, new PointF(tcur.getScreenX(width) - 10, tcur.getScreenY(height) - 10));
                }
            }
        }

        // draw the objects
        if (objectList.Count > 0)
        {
            lock (objectList)
            {
                foreach (TuioObject tobj in objectList.Values)
                {
                    int ox = tobj.getScreenX(width);
                    int oy = tobj.getScreenY(height);
                    int size = height / 10;

                    /*if (tobj.SymbolID == 0)
                    {
                        int imageX = ox;

                        int imageY = oy;//

                        g.TranslateTransform(imageX, imageY);
                        g.RotateTransform(tobj.Angle);
                        g.TranslateTransform(-imageX, -imageY);

                        g.DrawImage(markerImage, imageX, imageY);
                    }*/




                    g.TranslateTransform(ox, oy);
                    g.RotateTransform((float)(tobj.Angle / Math.PI * 180.0f));
                    g.TranslateTransform(-ox, -oy);

                    g.FillRectangle(objBrush, new Rectangle(ox - size / 2, oy - size / 2, size, size));

                    g.TranslateTransform(ox, oy);
                    g.RotateTransform(-1 * (float)(tobj.Angle / Math.PI * 180.0f));
                    g.TranslateTransform(-ox, -oy);

                    g.DrawString(tobj.SymbolID + "", font, fntBrush, new PointF(ox, oy));

                    if (tobj.SymbolID == 0)
                    {
                        g.DrawString(tobj.Angle * (180 / Math.PI) + "", font, fntBrush, new PointF(ox - 10, oy - 10));
                        if (tobj.Angle * (180 / Math.PI) > 0.0 && tobj.Angle * (180 / Math.PI) <= 10.0)
                        {
                            flag = 1;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 10.0 && tobj.Angle * (180 / Math.PI) <= 20.0)
                        {
                            flag = 2;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 20.0 && tobj.Angle * (180 / Math.PI) <= 30.0)
                        {
                            flag = 3;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 30.0 && tobj.Angle * (180 / Math.PI) <= 40.0)
                        {
                            flag = 4;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 40.0 && tobj.Angle * (180 / Math.PI) <= 50.0)
                        {
                            flag = 5;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 50.0 && tobj.Angle * (180 / Math.PI) <= 60.0)
                        {
                            flag = 6;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 60.0 && tobj.Angle * (180 / Math.PI) <= 80.0)
                        {
                            flag = 7;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 80.0 && tobj.Angle * (180 / Math.PI) <= 90.0)
                        {
                            flag = 8;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 90.0 && tobj.Angle * (180 / Math.PI) <= 100.0)
                        {
                            flag = 9;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 100.0 && tobj.Angle * (180 / Math.PI) <= 110.0)
                        {
                            flag = 10;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 110.0 && tobj.Angle * (180 / Math.PI) <= 120.0)
                        {
                            flag = 11;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 120.0 && tobj.Angle * (180 / Math.PI) <= 130.0)
                        {
                            flag = 12;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 130.0 && tobj.Angle * (180 / Math.PI) <= 140.0)
                        {
                            flag = 13;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 140.0 && tobj.Angle * (180 / Math.PI) <= 150.0)
                        {
                            flag = 14;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 150.0 && tobj.Angle * (180 / Math.PI) <= 160.0)
                        {
                            flag = 15;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 160.0 && tobj.Angle * (180 / Math.PI) <= 170.0)
                        {
                            flag = 16;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 170.0 && tobj.Angle * (180 / Math.PI) <= 180.0)
                        {
                            flag = 17;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 180.0 && tobj.Angle * (180 / Math.PI) <= 190.0)
                        {
                            flag = 18;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 190.0 && tobj.Angle * (180 / Math.PI) <= 200.0)
                        {
                            flag = 19;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 200.0 && tobj.Angle * (180 / Math.PI) <= 210.0)
                        {
                            flag = 20;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 210.0 && tobj.Angle * (180 / Math.PI) <= 220.0)
                        {
                            flag = 21;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 220.0 && tobj.Angle * (180 / Math.PI) <= 230.0)
                        {
                            flag = 22;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 230.0 && tobj.Angle * (180 / Math.PI) <= 240.0)
                        {
                            flag = 23;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 240.0 && tobj.Angle * (180 / Math.PI) <= 250.0)
                        {
                            flag = 24;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 250.0 && tobj.Angle * (180 / Math.PI) <= 260.0)
                        {
                            flag = 25;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 260.0 && tobj.Angle * (180 / Math.PI) <= 270.0)
                        {
                            flag = 26;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 270.0 && tobj.Angle * (180 / Math.PI) <= 280.0)
                        {
                            flag = 27;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 280.0 && tobj.Angle * (180 / Math.PI) <= 290.0)
                        {
                            flag = 28;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 290.0 && tobj.Angle * (180 / Math.PI) <= 300.0)
                        {
                            flag = 29;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 300.0 && tobj.Angle * (180 / Math.PI) <= 310.0)
                        {
                            flag = 30;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 310.0 && tobj.Angle * (180 / Math.PI) <= 320.0)
                        {
                            flag = 31;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 320.0 && tobj.Angle * (180 / Math.PI) <= 330.0)
                        {
                            flag = 32;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 330.0 && tobj.Angle * (180 / Math.PI) <= 340.0)
                        {
                            flag = 33;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 340.0 && tobj.Angle * (180 / Math.PI) <= 350.0)
                        {
                            flag = 34;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }
                        else if (tobj.Angle * (180 / Math.PI) > 350.0 && tobj.Angle * (180 / Math.PI) < 360.0)
                        {
                            flag = 35;
                            g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        }

                        //byte[] byteData = BitConverter.GetBytes(flag);
                        //pythonSocket.Send(byteData);

                        pythonSocket.Send(Encoding.UTF8.GetBytes(flag.ToString()));

                        //g.DrawString(flag + "", font, fntBrush, new PointF(10, 10));
                        //Console.WriteLine("Angle: " + tobj.Angle);
                    }



                    if (tobj.SymbolID == 1)
                    {
                        playflag = 36;
                        if (CurrentState != playflag)
                        {
                            pythonSocket.Send(Encoding.UTF8.GetBytes(playflag.ToString()));
                        }
                        CurrentState = playflag;
                    }
                    if (tobj.SymbolID == 2)
                    {
                        pauseflag = 37;
                        if (CurrentState != pauseflag)
                        {
                            pythonSocket.Send(Encoding.UTF8.GetBytes(pauseflag.ToString()));
                        }
                        CurrentState = pauseflag;
                    }
                    if (tobj.SymbolID == 3)
                    {
                        nextflag = 38;
                        if (CurrentState != nextflag)
                        {
                            pythonSocket.Send(Encoding.UTF8.GetBytes(nextflag.ToString()));
                        }
                        CurrentState = nextflag;
                    }
                    if (tobj.SymbolID == 4)
                    {
                        prevflag = 39;
                        if (CurrentState != prevflag)
                        {
                            pythonSocket.Send(Encoding.UTF8.GetBytes(prevflag.ToString()));
                        }
                        CurrentState = prevflag;
                    }

                    if (tobj.SymbolID == 5)
                    {
                        user = "Mohab";
                        if (CurrentUser != user)
                        {
                            pythonSocket.Send(Encoding.UTF8.GetBytes(user.ToString()));
                        }
                        CurrentUser = user;
                    }
                    if (tobj.SymbolID == 6)
                    {
                        user = "Ahmed";
                        if (CurrentUser != user)
                        {
                            pythonSocket.Send(Encoding.UTF8.GetBytes(user.ToString()));
                        }
                        CurrentUser = user;
                    }
                    if (tobj.SymbolID == 7)
                    {
                        user = "Asmaa";
                        if (CurrentUser != user)
                        {
                            pythonSocket.Send(Encoding.UTF8.GetBytes(user.ToString()));
                        }
                        CurrentUser = user;
                    }
                    if (tobj.SymbolID == 8)
                    {
                        user = "Samar";
                        if (CurrentUser != user)
                        {
                            pythonSocket.Send(Encoding.UTF8.GetBytes(user.ToString()));
                        }
                        CurrentUser = user;
                    }
                }
            }
        }


        // draw the blobs
        if (blobList.Count > 0)
        {
            lock (blobList)
            {
                foreach (TuioBlob tblb in blobList.Values)
                {
                    int bx = tblb.getScreenX(width);
                    int by = tblb.getScreenY(height);
                    float bw = tblb.Width * width;
                    float bh = tblb.Height * height;

                    g.TranslateTransform(bx, by);
                    g.RotateTransform((float)(tblb.Angle / Math.PI * 180.0f));
                    g.TranslateTransform(-bx, -by);

                    g.FillEllipse(blbBrush, bx - bw / 2, by - bh / 2, bw, bh);

                    g.TranslateTransform(bx, by);
                    g.RotateTransform(-1 * (float)(tblb.Angle / Math.PI * 180.0f));
                    g.TranslateTransform(-bx, -by);

                    g.DrawString(tblb.BlobID + "", font, fntBrush, new PointF(bx, by));
                }
            }
        }
    }


    public static void Main(String[] argv)
    {
        int port = 0;
        switch (argv.Length)
        {
            case 1:
                port = int.Parse(argv[0], null);
                if (port == 0) goto default;//fupdate
                break;
            case 0:
                port = 3333;
                break;
            default:
                Console.WriteLine("usage: mono TuioDemo [port]");
                System.Environment.Exit(0);
                break;
        }

        TuioDemo app = new TuioDemo(port);
        Application.Run(app);
    }
}
