
package cdn.common;

import java.io.BufferedReader;
import java.io.Console;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 *
 * @author SKR
 */
public class ConsoleInput implements AutoCloseable
{
	private InputStream inputStream = null;
	private BufferedReader bufferedReader = null;

	public ConsoleInput()
	{
		inputStream = System.in;
		updateBufferedReader();
	}

	public ConsoleInput(InputStream inputStream)
	{
		this.inputStream = inputStream;
		updateBufferedReader();
	}

	public InputStream getIn()
	{
		return inputStream;
	}

	public void setIn(InputStream in)
	{
		this.inputStream = in;
		updateBufferedReader();
	}

	private void updateBufferedReader()
	{
		bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
	}

	private String readConsoleLine() throws IOException
	{
		return bufferedReader.readLine();
	}

	public String readPassword() throws IOException
	{
		String pass = null;

		Console console = System.console();
		if (console != null)
		{
			pass = new String(console.readPassword());
		} else
		{
			pass = readConsoleLine();
		}

		return pass;
	}

	public String readString() throws IOException
	{
		return readConsoleLine();
	}

	public int readInt() throws IOException
	{
		return Integer.parseInt(this.readConsoleLine());
	}

	public float readFloat() throws IOException
	{
		return Float.parseFloat(this.readConsoleLine());
	}

	public double readDouble() throws IOException
	{
		return Double.parseDouble(this.readConsoleLine());
	}

	public boolean readBoolean() throws IOException
	{
		return Boolean.parseBoolean(this.readConsoleLine());
	}

	@Override
	public void close() throws Exception
	{
		if (this.inputStream != null)
		{
			this.inputStream.close();
		}

		if (this.bufferedReader != null)
		{
			this.bufferedReader.close();
		}
	}
}
